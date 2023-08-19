//Html'den gelen alanları
const catogoryList = document.querySelector(".catogories");
const productsArea = document.querySelector(".products");
const basketBtn = document.querySelector("#basket");
const closeBtn = document.querySelector("#close");
const modal = document.querySelector(".modal-wrapper");
const basketList = document.querySelector("#list")
const totalSpan = document.querySelector('#total-price')
const totalCount = document.querySelector('#count')
//!Api işlemleri
// html'nin yüklenme anı
document.addEventListener("DOMContentLoaded", () => {
  fetchCatogories();
  fetchProducts();
});
const baseUrl = "https://api.escuelajs.co/api/v1";
/*
 *1- Apiye istek at
 *2- Gelen veriyi işle
 *3-Gelem verileri kart şeklinde basacak fonksiyonu çalıştır
 *4-Cevap hatalı olursakullanıcıyı bilgilendir
 */
function fetchCatogories() {
  fetch(`${baseUrl}/categories`)
    //Eğer veri olumlu olursa çalışır
    .then((res) => res.json()) //json formatına çevirir
    .then((data) => renderCatogories(data.slice(1, 5)))
    .catch((eror) => console.log(eror)); // cevapta hata varsa çalıştırır
}

function renderCatogories(catogories) {
  catogories.forEach((catogory) => {
    //1- Div oluşturma

    const catogoriyDiv = document.createElement("div");

    //2- dive class ekleme
    catogoriyDiv.classList.add("catogory-cart");

    //3-divin içeriğini belirleme
    catogoriyDiv.innerHTML = `
    <img src=${catogory.image}>
    <p>${catogory.name}</p>
 `;

    //4-elemanı htmlde catogoriye ekleme

    catogoryList.appendChild(catogoriyDiv);
  });
}

// Ürünler için istek at

async function fetchProducts() {
  try {
    const res = await fetch(`${baseUrl}/products`);
    const data = await res.json();
    renderProducts(data.slice(0, 24));
  } catch (err) {
    //hata olursa yakalar
  }
}

//Ürünleri ekrana basar
function renderProducts(products) {
  //her bir üürn için bir html oluştur
  const productsHTML = products
    .map(
      (product) => `
        <div  class="card">
          <img src=${product.images[0]} />
          <h4>${product.title}</h4>
          <h4>${product.category.name ? product.category.name : "Diğer"}</h4>
          <div class="action">
            <span>${product.price} &#8378;</span>
            <button onclick="addToBasket({id:${product.id}, title:'${
        product.title
      }', price:${product.price}, img:'${
        product.images[0]
      }', amount:1})">Sepete Ekle</button>
          </div>
        </div>
 `
    )
    .join(" ");
  //Burda html yi listeye gönder
  productsArea.innerHTML = productsHTML;
}
// Sepet işlemleri
let basket = [];
let total =0;

//! Modal işlemleri
basketBtn.addEventListener("click", () => {
  //Sepeti açama
  modal.classList.add("active");
  //Sepete ürünlei listeleme
  renderBasket();
});
closeBtn.addEventListener("click", () => {
  // sepeti kapatma
  modal.classList.remove("active");
});

//! Sepet işlemleri
//Sepete ekleme işlemi
function addToBasket(product) {
  //Ürün sepete daha önce eklenmişmi
  const found = basket.find((i) => i.id === product.id);

  if(found){
    //Eleman sepete var > miktarına ekle
    found.amount++;
   
  }else{
    // Eleman sepette yok
    basket.push(product);
  }
 
 
}

//Sepete elemanları listeleme

function renderBasket() {
  // kartları oluşturma
  const cardsHTML = basket
    .map(
      (product) => `
     <div class="item">
            <img src=${product.img} />
            <h3 class="title">${product.title}</h3>
            <h4 class="price">${product.price} &#8378;</h4>
            <p>Miktar: ${product.amount}</p>
            <img onclick="deleteItem(${product.id})" id="delete" src="/img/trash.png" />
      </div>
  `
    )
    .join(' ');

  // hazıldaığımız kartları HTML'e gönderme
  basketList.innerHTML = cardsHTML;

  // toplam değeri hesapla
  calculateTotal();
}

//Sepet toplamı ayarlama
function calculateTotal() {
  // toplam fiyatı hesaplama
  const sum = basket.reduce((sum, i) => sum + i.price * i.amount, 0);

  // ürün miktarını hesaplama
  const amount = basket.reduce((sum, i) => sum + i.amount, 0);

  // miktarı html'e gönderme
  totalCount.innerText = amount + ' ' + 'Ürün';

  // toplam değeri html'e gönderme
  totalSpan.innerText = sum;
}

//Sepetten ürünü silme fonksiyonu

function deleteItem(deleteid){
 basket = basket.filter((i) => i.id !==deleteid);
//listeyi güncelle
renderBasket();
//toplamı güncelle
calculateTotal();
}