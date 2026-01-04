# এগ্রোমার্ট - বিস্তারিত ফাংশন ব্যাখ্যা

এই নথিতে এগ্রোমার্ট অ্যাপ্লিকেশনের মূল ফাংশনগুলো কীভাবে কাজ করে এবং ফ্রন্টএন্ড কীভাবে ব্যাকএন্ডের সাথে যোগাযোগ করে তা বিস্তারিত আলোচনা করা হয়েছে।

## ১. অথেন্টিকেশন (Authentication)

### ব্যাকএন্ড: লগইন এপিআই
এই ফাংশনটি গ্রাহক (Customer) এবং কৃষক (Farmer) উভয়ের লগইন প্রক্রিয়া পরিচালনা করে।

[app/api/auth/login/route.js](app/api/auth/login/route.js#L4-L30)

```javascript
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, mobile, password, role } = body;

    // ... validation logic ...

    let user;
    if (role === 'customer') {
      user = await prisma.user.findUnique({ where: { email } });
    } else if (role === 'farmer') {
      user = await prisma.user.findUnique({ where: { mobile } });
    }

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ message: 'Login successful', user: userWithoutPassword }, { status: 200 });

  } catch (error) {
    // ... error handling ...
  }
}
```

**এটি কীভাবে কাজ করে:**
*   এটি ক্রেডেনশিয়াল এবং `role` ('customer' বা 'farmer') সহ একটি JSON বডি গ্রহণ করে।
*   এটি ইমেল (গ্রাহকদের জন্য) বা মোবাইল (কৃষকদের জন্য) এর সাথে মিল রেখে ব্যবহারকারী খুঁজে পেতে প্রিজমা (Prisma) ব্যবহার করে ডাটাবেসে কুয়েরি করে।
*   এটি পাসওয়ার্ড মিলছে কিনা তা যাচাই করে।
*   সফল হলে, এটি ফ্রন্টএন্ড সেশনে সংরক্ষণের জন্য ব্যবহারকারীর তথ্য (পাসওয়ার্ড ছাড়া) ফেরত দেয়।

---

## ২. পণ্য ব্যবস্থাপনা (Product Management)

### ব্যাকএন্ড: পণ্য দেখা (Get Products)
ডাটাবেস থেকে পণ্যগুলো নিয়ে আসে, এবং প্রয়োজনে ফিল্টার করে।

[app/api/products/route.js](app/api/products/route.js#L4-L20)

```javascript
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const farmerId = searchParams.get('farmerId');

    let where = {};
    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }
    if (farmerId) {
      where.farmerId = parseInt(farmerId);
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    // ... return response ...
  } catch (error) {
    // ... error handling ...
  }
}
```

**এটি কীভাবে কাজ করে:**
*   এটি URL থেকে কুয়েরি প্যারামিটার (`?category=...` বা `?farmerId=...`) পড়ে।
*   এটি ফলাফল ফিল্টার করার জন্য ডায়নামিকভাবে একটি প্রিজমা `where` ক্লজ তৈরি করে।
*   এটি নতুন পণ্যগুলো আগে দেখানোর ক্রমে পণ্যের তালিকা ফেরত দেয়।

### ফ্রন্টএন্ড: নতুন পণ্য জমা দেওয়া (Submit Product)
যখন একজন কৃষক নতুন পণ্য যোগ করেন তখন এই ফর্ম সাবমিশনটি কাজ করে।

[app/add-product/page.jsx](app/add-product/page.jsx#L68-L100)

```javascript
  const onSubmit = async (formData) => {
    // ... validation ...
    
    const loggedFarmerStr = localStorage.getItem("currentFarmer") || sessionStorage.getItem("currentFarmer");
    // ... auth check ...
    const farmer = JSON.parse(loggedFarmerStr);

    const saveProduct = async (imgData) => {
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            img: imgData,
            farmerId: farmer.id
          }),
        });

        if (res.ok) {
          toast.success(`${formData.category} product added successfully!`);
          router.push("/farmer-homepage");
        }
        // ... error handling ...
      } catch (error) {
        // ... error handling ...
      }
    };
    // ... image processing ...
  };
```

**এটি কীভাবে কাজ করে:**
*   এটি লোকাল/সেশন স্টোরেজ থেকে লগ-ইন করা কৃষকের আইডি সংগ্রহ করে।
*   এটি আপলোড করা ছবির ফাইলটিকে Base64 স্ট্রিং-এ রূপান্তর করে (যাতে এটি ডাটাবেসে টেক্সট হিসেবে সংরক্ষণ করা যায়)।
*   এটি পণ্যের সমস্ত বিবরণ সহ `/api/products`-এ একটি `POST` রিকোয়েস্ট পাঠায়।

---

## ৩. অর্ডার প্রসেসিং (Order Processing)

### ফ্রন্টএন্ড: চেকআউট শুরু (Checkout Initiation)
পেমেন্ট পেজে যাওয়ার আগে ব্যবহারকারীর সেশন যাচাই করে।

[app/cart/page.jsx](app/cart/page.jsx#L32-L40)

```javascript
  const handleCheckout = () => {
    const userStr = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (!userStr) {
      toast.error("Please login to checkout");
      router.push("/customer-login");
      return;
    }
    router.push('/payment');
  };
```

### ফ্রন্টএন্ড: পেমেন্ট সম্পন্ন করা (Process Payment)
একটি পেমেন্ট সিমুলেট করে এবং অর্ডার তৈরি করে।

[app/payment/page.jsx](app/payment/page.jsx#L32-L70)

```javascript
  const handlePayment = async (e) => {
    e.preventDefault();
    
    // ... validation ...
    // Fake payment: accept any card info
    if (!cardNumber || !expiry || !cvv) {
      toast.error("Please enter card details");
      return;
    }

    // ... auth check ...

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: cartItems,
          total: totalPrice,
          address
        }),
      });

      if (res.ok) {
        toast.success("Payment Successful! Order Placed.");
        localStorage.removeItem("cart");
        router.push("/my-orders");
      }
      // ... error handling ...
    } catch (error) {
       // ... error handling ...
    }
  };
```

### ব্যাকএন্ড: অর্ডার তৈরি (Create Order API)
অর্ডার এবং এর আইটেমগুলো ডাটাবেসে ট্রানজ্যাকশনের মাধ্যমে সংরক্ষণ করে।

[app/api/orders/route.js](app/api/orders/route.js#L26-L50)

```javascript
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, items, total, address } = body;

    // ... validation ...

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const order = await tx.order.create({
        data: {
          userId: parseInt(userId),
          total: parseFloat(total),
          address,
          status: 'Pending',
        },
      });

      // 2. Process items
      for (const item of items) {
        // ... stock check ...
        // Create OrderItem linked to Order
        // ...
      }
      return order;
    });
    // ... return response ...
  } catch (error) {
    // ... error handling ...
  }
}
```

**এটি কীভাবে কাজ করে:**
*   এটি ডাটা ইন্টিগ্রিটি নিশ্চিত করতে `prisma.$transaction` ব্যবহার করে। যদি প্রক্রিয়ার কোনো অংশ ব্যর্থ হয় (যেমন, কোনো আইটেম তৈরি করা), তবে পুরো অর্ডারটি বাতিল হয়ে যাবে।
*   এটি প্রথমে একটি আইডি পেতে `Order` তৈরি করে।
*   তারপর এটি কার্ট আইটেমগুলোর ওপর লুপ চালায় এবং সেই অর্ডার আইডির সাথে লিঙ্ক করা `OrderItem` রেকর্ড তৈরি করে।
