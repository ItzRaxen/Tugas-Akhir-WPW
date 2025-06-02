const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

// Setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware untuk menyajikan file statis
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk parsing body dari form POST
app.use(express.urlencoded({ extended: true }));

// Konfigurasi express-session
app.use(session({
    secret: 'gantiDenganSecretKeySuperAmanDanAcakAndaSendiri', // GANTI DENGAN SECRET YANG KUAT!
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set true jika menggunakan HTTPS di produksi
}));

// Middleware untuk membuat cart tersedia di semua view
app.use((req, res, next) => {
    res.locals.cart = req.session.cart || [];
    next();
});

// === DATA PRODUK TERPUSAT ===
const allProducts = [
    {
        id: "prosesor-alpha-x1",
        name: "Prosesor Super Cepat Alpha X1",
        price: 3750000,
        rawPrice: "Rp 3.750.000",
        images: ["/images/produk/prosesor_alpha_main.png", "/images/produk/prosesor_alpha_1.png", "/images/produk/prosesor_alpha_2.png"],
        mainImage: "/images/produk/prosesor_alpha_main.png",
        stock: 50,
        new: true,
        bestSeller: false,
        category: "Prosesor",
        description: "Rasakan kecepatan komputasi tak tertandingi dengan Prosesor Alpha X1. Dirancang untuk gaming berat dan multitasking profesional, prosesor ini hadir dengan 8 core dan 16 thread, serta kecepatan boost hingga 5.0 GHz. Teknologi fabrikasi terbaru memastikan efisiensi daya yang optimal.",
        specifications: [
            { label: "Jumlah Core", value: "8" }, { label: "Jumlah Thread", value: "16" },
            { label: "Base Clock", value: "3.8 GHz" }, { label: "Boost Clock", value: "5.0 GHz" },
            { label: "TDP", value: "125W" }
        ]
    },
    {
        id: "vga-extreme-z90",
        name: "VGA Gaming Extreme Z90 16GB",
        price: 15200000,
        rawPrice: "Rp 15.200.000",
        images: ["/images/produk/vga_extreme_main.png", "/images/produk/vga_extreme_1.png"],
        mainImage: "/images/produk/vga_extreme_main.png",
        stock: 25,
        new: false,
        bestSeller: true,
        category: "Kartu Grafis",
        description: "Dominasi setiap game dengan VGA Gaming Extreme Z90. Dilengkapi dengan memori GDDR6X 16GB dan arsitektur GPU terbaru...",
        specifications: [
            { label: "Memori", value: "16GB GDDR6X" },
            { label: "Interface", value: "PCI Express 4.0" }
        ]
    },
    {
        id: "ssd-ultraspeed-2tb",
        name: "SSD NVMe UltraSpeed 2TB Gen4",
        price: 2100000,
        rawPrice: "Rp 2.100.000",
        images: ["/images/produk/ssd_ultraspeed_main.png"],
        mainImage: "/images/produk/ssd_ultraspeed_main.png",
        stock: 100,
        new: true,
        bestSeller: true,
        category: "Penyimpanan",
        description: "Percepat waktu boot dan loading aplikasi Anda secara drastis...",
        specifications: [
            { label: "Kapasitas", value: "2TB" },
            { label: "Form Factor", value: "M.2 2280" },
            { label: "Interface", value: "PCIe Gen4 x4 NVMe" }
        ]
    },
    {
        id: "keyboard-mech-pro-rgb",
        name: "Keyboard Mekanikal Pro RGB",
        price: 950000,
        rawPrice: "Rp 950.000",
        images: ["/images/produk/keyboard_mech_main.png", "/images/produk/keyboard_mech_1.png"],
        mainImage: "/images/produk/keyboard_mech_main.png",
        stock: 75,
        new: false,
        bestSeller: false,
        category: "Keyboard",
        description: "Tingkatkan pengalaman mengetik dan gaming Anda...",
        specifications: [
            { label: "Tipe Switch", value: "Blue Mechanical (Clicky)" },
            { label: "Layout", value: "Full Size (104 Tombol)" }
        ]
    }
];

// Data umum untuk halaman
const siteData = {
    storeName: "Penscomp",
    categories: [
        { name: "Prosesor (CPU)", icon: "fa-microchip", slug: "prosesor-cpu" },
        { name: "Motherboard", icon: "fa-server", slug: "motherboard" },
        { name: "Kartu Grafis (VGA)", icon: "fa-gamepad", slug: "kartu-grafis-vga" },
        { name: "RAM (Memori)", icon: "fa-memory", slug: "ram-memori" },
        { name: "Penyimpanan (SSD/HDD)", icon: "fa-hdd", slug: "penyimpanan-ssd-hdd" },
        { name: "Power Supply (PSU)", icon: "fa-bolt", slug: "power-supply-psu" },
        { name: "Casing Komputer", icon: "fa-cube", slug: "casing-komputer" },
        { name: "Monitor", icon: "fa-desktop", slug: "monitor" },
        { name: "Keyboard & Mouse", icon: "fa-keyboard", slug: "keyboard-mouse" },
        { name: "Aksesoris", icon: "fa-headphones", slug: "aksesoris" }
    ],
    advantages: [
        { text: "Produk Terlengkap", detail: "Komponen & Aksesoris dari A-Z", icon: "fa-archive" },
        { text: "Harga Kompetitif", detail: "Penawaran Terbaik untuk Anda", icon: "fa-tags" },
        { text: "Garansi Resmi", detail: "Jaminan Kualitas & Keaslian", icon: "fa-shield-alt" },
        { text: "Pengiriman Cepat", detail: "Ke Seluruh Indonesia", icon: "fa-truck" }
    ],
    formatPrice: (num) => {
        if (typeof num !== 'number') return "Rp 0";
        return "Rp" + num.toLocaleString('id-ID');
    }
};

// Route untuk halaman utama (landing page)
app.get('/', (req, res) => {
    res.render('landing', {
        ...siteData,
        featuredProducts: allProducts.slice(0, 4)
    });
});

// ROUTE UNTUK DETAIL PRODUK
app.get('/produk/:id', (req, res) => {
    const productId = req.params.id;
    const product = allProducts.find(p => p.id === productId);

    if (product) {
        const categoryData = siteData.categories.find(cat => cat.name === product.category);
        const categorySlug = categoryData ? categoryData.slug : "umum";

        res.render('produk-detail', {
            ...siteData,
            product: product,
            categorySlug: categorySlug
        });
    } else {
        res.status(404).render('404', { ...siteData, message: 'Produk tidak ditemukan' });
    }
});

// === RUTE-RUTE KERANJANG ===

// Tambah produk ke keranjang (HANYA SATU DEFINISI INI)
app.post('/keranjang/tambah', (req, res) => {
    console.log('--- Rute /keranjang/tambah diakses (POST) ---');
    console.log('Request Body (req.body):', req.body);

    const { productId, quantity } = req.body;
    const productToAdd = allProducts.find(p => p.id === productId);
    const qty = parseInt(quantity, 10) || 1;

    if (!productToAdd) {
        console.log('Error di /keranjang/tambah: Produk tidak ditemukan untuk ID:', productId);
        // Anda bisa mengirim flash message di sini jika menggunakan connect-flash
        return res.redirect('back');
    }

    if (!req.session.cart) {
        req.session.cart = [];
        console.log('Keranjang baru dibuat di sesi.');
    }

    const cart = req.session.cart;
    const existingItemIndex = cart.findIndex(item => item.id === productId);

    if (existingItemIndex > -1) {
        const currentQtyInCart = cart[existingItemIndex].quantity;
        if (currentQtyInCart + qty > productToAdd.stock) {
            console.log(`Stok tidak cukup untuk ${productToAdd.name}. Diminta: ${currentQtyInCart + qty}, Ada di keranjang: ${currentQtyInCart}, Stok: ${productToAdd.stock}`);
            // Di sini Anda bisa menambahkan logika untuk memberi tahu pengguna, misalnya dengan flash message
            // Untuk sementara, kita tidak akan menambahkan melebihi stok.
            // Atau bisa juga set ke stok maksimal: cart[existingItemIndex].quantity = productToAdd.stock;
            return res.redirect('back'); // Redirect kembali, idealnya dengan pesan error
        }
        cart[existingItemIndex].quantity += qty;
        console.log('Kuantitas produk diperbarui di keranjang:', cart[existingItemIndex]);
    } else {
        if (qty > productToAdd.stock) {
            console.log(`Stok tidak cukup untuk ${productToAdd.name}. Diminta: ${qty}, Stok: ${productToAdd.stock}`);
            return res.redirect('back'); // Redirect kembali, idealnya dengan pesan error
        }
        const newItem = {
            id: productToAdd.id,
            name: productToAdd.name,
            price: productToAdd.price,
            rawPrice: productToAdd.rawPrice,
            quantity: qty,
            mainImage: productToAdd.mainImage
        };
        cart.push(newItem);
        console.log('Produk baru ditambahkan ke keranjang:', newItem);
    }
    console.log('Isi keranjang saat ini:', req.session.cart);
    res.redirect('/keranjang');
});

// Tampilkan halaman keranjang
app.get('/keranjang', (req, res) => {
    const cartItems = req.session.cart || [];
    let totalPrice = 0;
    cartItems.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    res.render('keranjang', {
        ...siteData,
        cartItems: cartItems,
        totalPrice: totalPrice
    });
});

// Update kuantitas item di keranjang
app.post('/keranjang/update/:id', (req, res) => {
    const productId = req.params.id;
    const newQuantity = parseInt(req.body.quantity, 10);
    const cart = req.session.cart || [];

    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        const productInCart = cart[itemIndex]; // Produk yang ada di keranjang
        const productMasterData = allProducts.find(p => p.id === productId); // Data produk dari master list (untuk info stok)

        if (newQuantity > 0) {
            if (productMasterData && newQuantity <= productMasterData.stock) {
                productInCart.quantity = newQuantity;
            } else if (productMasterData && newQuantity > productMasterData.stock) {
                productInCart.quantity = productMasterData.stock; // Set ke stok maks jika melebihi
                console.log(`Kuantitas untuk ${productId} diubah ke stok maks: ${productMasterData.stock}`);
                // Tambahkan flash message di sini jika ingin memberi tahu pengguna
            } else { // Jika productMasterData tidak ditemukan (seharusnya tidak terjadi jika ID valid)
                 productInCart.quantity = newQuantity; // Update saja, meskipun tanpa cek stok
            }
        } else {
            // Jika kuantitas 0 atau kurang, hapus item
            cart.splice(itemIndex, 1);
        }
    }
    res.redirect('/keranjang');
});

// Hapus item dari keranjang
app.get('/keranjang/hapus/:id', (req, res) => {
    const productId = req.params.id;
    let cart = req.session.cart || [];
    req.session.cart = cart.filter(item => item.id !== productId);
    res.redirect('/keranjang');
});

// === RUTE UNTUK HALAMAN BELI (CHECKOUT) ===
app.get('/checkout', (req, res) => {
    const cartItems = req.session.cart || [];

    if (cartItems.length === 0) {
        // Jika keranjang kosong, redirect kembali ke halaman keranjang atau halaman utama
        // Anda bisa juga menambahkan flash message di sini
        console.log('Keranjang kosong, redirect dari /checkout ke /keranjang');
        return res.redirect('/keranjang');
    }

    let totalPrice = 0;
    cartItems.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    // Data yang akan dikirim ke halaman beli.ejs
    const checkoutData = {
        ...siteData,        // Kirim semua siteData (storeName, categories, formatPrice, dll.)
        cartItems: cartItems,
        totalPrice: totalPrice
        // Anda bisa menambahkan data lain yang spesifik untuk halaman checkout di sini
        // Misalnya: pilihan metode pembayaran, biaya ongkir default (jika ada), dll.
    };

    res.render('beli', checkoutData); // Merender file views/beli.ejs
});

// Middleware untuk halaman 404 (jika tidak ada rute yang cocok di atas)
app.use((req, res, next) => {
    res.status(404).render('404', { ...siteData, message: 'Halaman tidak ditemukan' });
});

// Error handler (opsional, tapi baik untuk menangkap error tak terduga)
app.use((err, req, res, next) => {
    console.error("Terjadi kesalahan:", err.stack); // Log error ke konsol server
    res.status(500).render('500', { // Anda perlu membuat file views/500.ejs
        ...siteData,
        error: { message: "Terjadi kesalahan pada server." } // Jangan kirim detail error ke klien di produksi
    });
});


app.listen(port, () => {
    console.log(`Server Penscomp berjalan di http://localhost:${port}`);
});