import { NextResponse } from "next/server";
import { randomBytes, randomInt } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type IncomingItem = {
  id: number;
  quantity: number;
  personalization?: string;
  personalizationData?: string;
  personalizationImageUrl?: string;
};

type PaymentSettings = {
  cod: boolean;
  upi: boolean;
  card: boolean;
};

const defaultPaymentSettings: PaymentSettings = {
  cod: true,
  upi: true,
  card: true,
};

const paymentSettingsFile = path.join(
  process.cwd(),
  "data",
  "payment-settings.json"
);

async function readPaymentSettings(): Promise<PaymentSettings> {
  try {
    const raw = await fs.readFile(paymentSettingsFile, "utf8");
    const parsed = JSON.parse(raw);

    return {
      cod: parsed?.cod !== false,
      upi: parsed?.upi !== false,
      card: parsed?.card !== false,
    };
  } catch {
    return defaultPaymentSettings;
  }
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value: unknown) {
  return cleanString(value).toLowerCase();
}

function makeOrderNumber() {
  return `ZEL-${Date.now().toString(36).toUpperCase()}-${randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;
}

function makeCustomerOrderId() {
  return randomInt(10000, 100000).toString();
}

async function makeUniqueCustomerOrderId(tx: any) {
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = makeCustomerOrderId();

    const existing = await tx.order.findUnique({
      where: {
        orderId: candidate,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return candidate;
    }
  }

  throw new Error(
    "Unable to generate a unique order ID. Please try again."
  );
}

function calculateDiscount(
  subtotal: number,
  discountType: string,
  discountValue: number
) {
  const type = discountType.toLowerCase();

  if (
    type === "percentage" ||
    type === "percent" ||
    type === "%"
  ) {
    return Math.min(
      subtotal,
      (subtotal * discountValue) / 100
    );
  }

  return Math.min(subtotal, discountValue);
}

function safeCustomizationPath(url: string) {
  if (!url.startsWith("/uploads/customizations/")) {
    throw new Error("Invalid personalization image.");
  }

  const relative = url.replace(/^\/+/, "");

  const publicRoot = path.resolve(
    process.cwd(),
    "public"
  );

  const filePath = path.resolve(
    publicRoot,
    relative
  );

  if (
    filePath !== publicRoot &&
    !filePath.startsWith(`${publicRoot}${path.sep}`)
  ) {
    throw new Error("Invalid personalization image.");
  }

  return filePath;
}

async function moveCustomizationImage(
  temporaryUrl: string,
  orderNumber: string,
  suffix: string
) {
  const sourcePath =
    safeCustomizationPath(temporaryUrl);

  await fs.access(sourcePath);

  const extension =
    path.extname(sourcePath).toLowerCase() ||
    ".jpg";

  /*
   * Keep the destination statically scoped to the known
   * customization-upload directory. This preserves the existing
   * file-moving behavior while allowing Turbopack to trace only
   * the intended directory instead of the whole project.
   */
  const customizationDirectory = path.join(
    process.cwd(),
    "public",
    "uploads",
    "customizations"
  );

  const targetFilename =
    `${orderNumber}${suffix}${extension}`;

  const targetPath = path.join(
    customizationDirectory,
    targetFilename
  );

  await fs.rename(
    sourcePath,
    targetPath
  );

  return {
    url: `/uploads/customizations/${targetFilename}`,
    sourcePath,
    targetPath,
  };
}

async function restoreMovedImages(
  moved: Array<{
    sourcePath: string;
    targetPath: string;
  }>
) {
  for (const file of moved.reverse()) {
    try {
      await fs.rename(
        file.targetPath,
        file.sourcePath
      );
    } catch {
      // Best-effort rollback.
    }
  }
}

/*
|--------------------------------------------------------------------------
| GET /api/orders
|--------------------------------------------------------------------------
| Returns the currently logged-in user's real orders.
*/
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          {
            userId: session.userId,
          },
          {
            user: {
              email: session.email.toLowerCase(),
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: {
                    position: "asc",
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      orders: orders.map((order) => ({
        ...order,
        items: order.items.map((item) => ({
          ...item,
          product: {
            ...item.product,
            image:
              item.product.images[0]?.url ?? null,
          },
        })),
      })),
    });
  } catch (error) {
    console.error(
      "Get orders error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load orders.",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST /api/orders
|--------------------------------------------------------------------------
| Existing checkout/order creation logic.
*/
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // For signed-in customers, the authenticated account is the
    // authoritative owner of the order. Checkout email is still used
    // for contact/validation, but never to reassign an order.
    const session = await getSession();

    const firstName = cleanString(
      body?.customer?.firstName
    );

    const lastName = cleanString(
      body?.customer?.lastName
    );

    const email = normalizeEmail(
      body?.customer?.email
    );

    const phone = cleanString(
      body?.customer?.phone
    );

    const address = cleanString(
      body?.shipping?.address
    );

    const apartment = cleanString(
      body?.shipping?.apartment
    );

    const city = cleanString(
      body?.shipping?.city
    );

    const state = cleanString(
      body?.shipping?.state
    );

    const pincode = cleanString(
      body?.shipping?.pincode
    );

    const fullAddress = [
      address,
      apartment,
    ]
      .filter(Boolean)
      .join(", ");

    const paymentMethod = cleanString(
      body?.paymentMethod
    ).toLowerCase();

    const couponCode = cleanString(
      body?.couponCode
    ).toUpperCase();

    const incomingItems: IncomingItem[] =
      Array.isArray(body?.items)
        ? body.items
            .map((item: any) => ({
              id: Number(item?.id),
              quantity: Math.floor(
                Number(item?.quantity)
              ),
              personalization:
                typeof item?.personalization ===
                "string"
                  ? item.personalization.trim()
                  : "",
              personalizationData:
                typeof item?.personalizationData ===
                "string"
                  ? item.personalizationData
                  : "",
              personalizationImageUrl:
                typeof item?.personalizationImageUrl ===
                "string"
                  ? item.personalizationImageUrl.trim()
                  : "",
            }))
            .filter(
              (item: IncomingItem) =>
                item.id > 0 &&
                item.quantity > 0
            )
        : [];

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete your contact details.",
        },
        { status: 400 }
      );
    }

    if (
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete your shipping address.",
        },
        { status: 400 }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid 6-digit pincode.",
        },
        { status: 400 }
      );
    }

    if (
      !["cod", "upi", "card"].includes(
        paymentMethod
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid payment method.",
        },
        { status: 400 }
      );
    }

    const paymentSettings =
      await readPaymentSettings();

    const methodEnabled =
      paymentSettings[
        paymentMethod as keyof PaymentSettings
      ];

    if (!methodEnabled) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This payment method is currently unavailable. Please choose another method.",
        },
        { status: 400 }
      );
    }

    if (!incomingItems.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    const uniqueItems = new Map<
      number,
      IncomingItem
    >();

    for (const item of incomingItems) {
      const existing =
        uniqueItems.get(item.id);

      if (existing) {
        existing.quantity += item.quantity;

        if (item.personalization) {
          existing.personalization =
            item.personalization;
        }

        if (item.personalizationData) {
          existing.personalizationData =
            item.personalizationData;
        }

        if (item.personalizationImageUrl) {
          existing.personalizationImageUrl =
            item.personalizationImageUrl;
        }
      } else {
        uniqueItems.set(item.id, {
          ...item,
        });
      }
    }

    const items = Array.from(
      uniqueItems.values()
    );

    const orderNumber =
      makeOrderNumber();

    const movedImages: Array<{
      sourcePath: string;
      targetPath: string;
      itemId: number;
    }> = [];

    try {
      const result =
        await prisma.$transaction(
          async (tx) => {
            const products =
              await tx.product.findMany({
                where: {
                  id: {
                    in: items.map(
                      (item) => item.id
                    ),
                  },
                  active: true,
                },
                include: {
                  images: {
                    orderBy: {
                      position: "asc",
                    },
                    take: 1,
                  },
                },
              });

            if (
              products.length !==
              items.length
            ) {
              throw new Error(
                "One or more products are no longer available."
              );
            }

            const productMap =
              new Map(
                products.map((product) => [
                  product.id,
                  product,
                ])
              );

            const orderItems = [];
            let subtotal = 0;

            for (const item of items) {
              const product =
                productMap.get(item.id);

              if (!product) {
                throw new Error(
                  "A product in your cart could not be found."
                );
              }

              if (
                product.stock <
                item.quantity
              ) {
                throw new Error(
                  `${product.name} has only ${product.stock} available.`
                );
              }

              let personalizationData =
                item.personalizationData ||
                "";

              if (personalizationData) {
                try {
                  const parsed =
                    JSON.parse(
                      personalizationData
                    );

                  personalizationData =
                    JSON.stringify(
                      Array.isArray(parsed)
                        ? parsed
                        : []
                    );
                } catch {
                  personalizationData =
                    "";
                }
              }

              const config =
                product.personalization
                  ? JSON.parse(
                      product.personalization
                    )
                  : {
                      enabled: false,
                      fields: [],
                    };

              const fields =
                config.enabled &&
                Array.isArray(
                  config.fields
                )
                  ? config.fields
                  : [];

              let submittedFields: any[] =
                [];

              if (personalizationData) {
                try {
                  const parsed =
                    JSON.parse(
                      personalizationData
                    );

                  if (
                    Array.isArray(parsed)
                  ) {
                    submittedFields =
                      parsed;
                  }
                } catch {
                  submittedFields = [];
                }
              }

              for (const field of fields) {
                if (!field.required)
                  continue;

                const submitted =
                  submittedFields.find(
                    (entry) =>
                      entry?.id ===
                      field.id
                  );

                const value =
                  typeof submitted?.value ===
                  "string"
                    ? submitted.value.trim()
                    : "";

                if (!value) {
                  throw new Error(
                    `${field.label} is required for ${product.name}.`
                  );
                }
              }

              subtotal +=
                product.price *
                item.quantity;

              orderItems.push({
                productId:
                  product.id,
                quantity:
                  item.quantity,
                price:
                  product.price,
                personalization:
                  item.personalization ||
                  null,
                personalizationData:
                  personalizationData ||
                  null,
                personalizationImageUrl:
                  null as string | null,
              });
            }

            let discount = 0;
            let appliedCouponCode:
              | string
              | null = null;

            if (couponCode) {
              const coupon =
                await tx.coupon.findUnique({
                  where: {
                    code: couponCode,
                  },
                });

              if (
                !coupon ||
                !coupon.active
              ) {
                throw new Error(
                  "This coupon is not valid."
                );
              }

              if (
                coupon.expiresAt &&
                coupon.expiresAt <=
                  new Date()
              ) {
                throw new Error(
                  "This coupon has expired."
                );
              }

              if (
                coupon.maxUses > 0 &&
                coupon.usedCount >=
                  coupon.maxUses
              ) {
                throw new Error(
                  "This coupon has reached its usage limit."
                );
              }

              if (
                subtotal <
                coupon.minOrder
              ) {
                throw new Error(
                  `This coupon requires a minimum order of ₹${coupon.minOrder.toLocaleString(
                    "en-IN"
                  )}.`
                );
              }

              discount =
                calculateDiscount(
                  subtotal,
                  coupon.discountType,
                  coupon.discountValue
                );

              appliedCouponCode =
                coupon.code;

              await tx.coupon.update({
                where: {
                  id: coupon.id,
                },
                data: {
                  usedCount: {
                    increment: 1,
                  },
                },
              });
            }

            const upiDiscount =
              paymentMethod === "upi"
                ? Math.min(
                    subtotal,
                    subtotal * 0.1
                  )
                : 0;

            const totalDiscount =
              discount + upiDiscount;

            const shippingFee = 0;

            const total = Math.max(
              0,
              subtotal +
                shippingFee -
                totalDiscount
            );

            let user;

            if (session) {
              // Always attach a signed-in customer's order to their
              // authenticated account ID, even if checkout email differs.
              user = await tx.user.findUnique({
                where: {
                  id: session.userId,
                },
              });

              if (!user) {
                throw new Error(
                  "Your customer account could not be found. Please sign in again."
                );
              }

              user = await tx.user.update({
                where: {
                  id: user.id,
                },
                data: {
                  name: `${firstName} ${lastName}`.trim(),
                },
              });
            } else {
              // Preserve the existing guest-checkout behavior.
              user = await tx.user.findUnique({
                where: {
                  email,
                },
              });

              if (!user) {
                user = await tx.user.create({
                  data: {
                    name: `${firstName} ${lastName}`.trim(),
                    email,
                    passwordHash: randomBytes(32).toString("hex"),
                  },
                });
              } else {
                user = await tx.user.update({
                  where: {
                    id: user.id,
                  },
                  data: {
                    name: `${firstName} ${lastName}`.trim(),
                  },
                });
              }
            }

            const customerOrderId =
              await makeUniqueCustomerOrderId(
                tx
              );

            const order =
              await tx.order.create({
                data: {
                  orderNumber,
                  orderId: customerOrderId,
                  status: "PENDING",
                  total,
                  shippingFee,
                  discount: totalDiscount,
                  couponCode:
                    appliedCouponCode,
                  paymentMethod,
                  address:
                    fullAddress,
                  city,
                  state,
                  pincode,
                  phone,
                  userId: user.id,
                  items: {
                    create:
                      orderItems,
                  },
                },
                include: {
                  items: {
                    include: {
                      product: true,
                    },
                  },
                },
              });

            for (
              let index = 0;
              index < items.length;
              index++
            ) {
              const incoming =
                items[index];

              if (
                !incoming.personalizationImageUrl
              ) {
                continue;
              }

              const matching =
                order.items.find(
                  (orderItem) =>
                    orderItem.productId ===
                    incoming.id
                );

              if (!matching) {
                continue;
              }

              const moved =
                await moveCustomizationImage(
                  incoming.personalizationImageUrl,
                  orderNumber,
                  order.items.length > 1
                    ? `-${matching.id}`
                    : ""
                );

              movedImages.push({
                sourcePath:
                  moved.sourcePath,
                targetPath:
                  moved.targetPath,
                itemId:
                  matching.id,
              });

              await tx.orderItem.update({
                where: {
                  id: matching.id,
                },
                data: {
                  personalizationImageUrl:
                    moved.url,
                },
              });
            }

            for (const item of items) {
              const updated =
                await tx.product.updateMany({
                  where: {
                    id: item.id,
                    active: true,
                    stock: {
                      gte: item.quantity,
                    },
                  },
                  data: {
                    stock: {
                      decrement:
                        item.quantity,
                    },
                  },
                });

              if (
                updated.count !== 1
              ) {
                throw new Error(
                  "Stock changed while placing your order. Please try again."
                );
              }
            }

            return tx.order.findUniqueOrThrow({
              where: {
                id: order.id,
              },
              include: {
                items: {
                  include: {
                    product: true,
                  },
                },
              },
            });
          }
        );

      return NextResponse.json({
        success: true,
        order: {
          id: result.id,
          orderId: result.orderId,
          orderNumber:
            result.orderNumber,
          status: result.status,
          total: result.total,
          discount: result.discount,
          paymentMethod:
            result.paymentMethod,
          createdAt:
            result.createdAt,
        },
      });
    } catch (error) {
      await restoreMovedImages(
        movedImages
      );
      throw error;
    }
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to place your order.",
      },
      { status: 400 }
    );
  }
}
