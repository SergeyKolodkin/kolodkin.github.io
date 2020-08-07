document.addEventListener('DOMContentLoaded',()=>{//callback-происходит определёное событие и запускается функция

    const search =document.querySelector('.search');

    const cartBtn =document.getElementById('cart');
    
    const wishlistBtn =document.getElementById('wishlist');
  
    const goodsWrapper = document.querySelector('.goods-wrapper');

    const cart = document.querySelector('.cart');
    const category =document.querySelector('.category');
    const wishlist =[];
    let goodsBasket={};

    const cardCounter= cartBtn.querySelector('.counter');
    const wishlistCounter=wishlistBtn.querySelector('.counter');
    const cartWrapper =document.querySelector('.cart-wrapper')
 

    const loading=(nameFunction)=>{
        const spinner=`<div id="spinner"><div class="spinner-loading"><div><div><div></div>
        </div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>`
        console.log(nameFunction)

        if(nameFunction==='renderCard'){
            goodsWrapper.innerHTML=spinner;
        }

        if(nameFunction==='renderCart'){
            cartWrapper.innerHTML=spinner;
            
        }
    }


    
     
    
 



    const createCardGoods= (id, title,price,img)=>{
        const card = document.createElement('div');
        card.className='card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3'
      
        card.innerHTML=`<div class="card">
        <div class="card-img-wrapper">
            <img class="card-img-top" src="${img}" alt="">
            <button class="card-add-wishlist ${wishlist.includes(id)?'active':''}" data-goods-id="${id}"></button>
        </div>
        <div class="card-body justify-content-between">
            <a href="#" class="card-title">${title}</a>
            <div class="card-price">${price}₽</div>
            <div>
                <button class="card-add-cart" data-goods-id="${id}"s>Добавить в корзину</button>
            </div>
        </div>
    </div>`

return card;

};



const closeCart=(event)=>
{
    const target = event.target;
 if(target===cart || target.classList.contains('cart-close')|| 
 event.keyCode === 27){
    cart.style.display='none'; 
    document.removeEventListener('keyup', closeCart); 
 }

 

}

const calcTotalPrice= goods=>{
    let sum =0;
    for (const item of goods){
        sum= sum+item.price*goodsBasket[item.id];
    }
    cart.querySelector ('.cart-total>span').textContent=sum;
}

const showCardBasket=goods=>{
    const  basketGoods=goods.filter(item=>goodsBasket.hasOwnProperty(item.id));
    calcTotalPrice( basketGoods);
     return  basketGoods; 
}


const openCart=()=>{

    cart.style.display='flex';
    document.addEventListener('keyup', closeCart);
    getGoods(renderCart,showCardBasket)
}

const renderCard=(items)=>{
    goodsWrapper.textContent='';
    

        if(items.length){
            items.forEach((item) => {
        const {id, title,price,imgMin}=item;// Диструктаризация
        goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin))
    });
        }else{
            goodsWrapper.textContent ='Нет товаров'
        }

}

const getGoods= (handler, filter)=>{
         loading(handler.name);
        fetch('db/db.json')
            .then(response=>  response.json())
            .then(filter)
            .then(handler); 
    }


const randomSort=(item)=>item.sort(()=>Math.random()-0.5);

const choiceCategory=(event)=>
{
    const target = event.target;
    if(target.classList.contains('category-item')){
        const category = target.dataset.category;
        getGoods(renderCard, goods=>{
            const newGods =goods.filter(item=> item.category.includes(category))
            return newGods
        })
    }
    
}

const searchGoods= (event)=>{

    event.preventDefault();
    const input =event.target.elements.searchGoods;
    const inputValue =input.value.trim();
    if(inputValue!=='')
    {
        const searchString =new RegExp(inputValue, 'i')
        getGoods(renderCard, goods=>goods.filter(item=> searchString.test(item.title))
     
        )
    }else
    {
        search.classList.add('error')
        setTimeout(()=>{
            search.classList.remove('error')
        }, 2000)
    }
    input.value='';
  
}

const getCookie=(name)=> {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
  

const cookieQuery = get=>{
    if(get){
        goodsBasket= JSON.parse(getCookie('goodsBasket'));
    }else{
        document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=3600`
    }
    checkOut();
    console.log(goodsBasket)
}

const checkOut=()=>{
    wishlistCounter.textContent= wishlist.length;
    cardCounter.textContent= Object.keys(goodsBasket).length;
   
}

const storegeQuery=(get)=>{
    if(get){
        if(localStorage.getItem('wishlist')){
        JSON.parse( localStorage.getItem('wishlist')).forEach(id => wishlist.push(id));
        };
    }else{
        localStorage.setItem('wishlist',JSON.stringify(wishlist))
    }
    checkOut();
   
}


const toggleWhishList=(id,elem)=>{
    if (wishlist.includes(id)){
        wishlist.splice(wishlist.indexOf(id),1);
        elem.classList.remove(`active`);
 
    }else{
        wishlist.push(id);
        elem.classList.add(`active`)
    
      
    }
    storegeQuery();
    checkOut();
}


const addBasket=id=>{
    if(goodsBasket[id]){
        goodsBasket[id]+=1;
    }else{
        goodsBasket[id]=1;
    }

    checkOut();
    cookieQuery();
};

const handlerGoods=event=>{
    const target =event.target;

    if(target.classList.contains('card-add-wishlist')){// если у нашей цели есть такой класс

        toggleWhishList(target.dataset.goodsId, target);    
    }

    if(target.classList.contains('card-add-cart')){
        addBasket(target.dataset.goodsId);
    }

}

const showWishlist=()=>{
    getGoods(renderCard, goods=> goods.filter(item=>wishlist.includes(item.id)))
}


// Делаем корзину

const createCartGoods= (id, title,price,img)=>{
    const cart = document.createElement('div');
    cart.className='goods'
  
    cart.innerHTML=`
    <div class="goods-img-wrapper">
        <img class="goods-img" src="${img}" alt="">

    </div>
    <div class="goods-description">
        <h2 class="goods-title">${title}</h2>
        <p class="goods-price">${price} ₽</p>

    </div>
    <div class="goods-price-count">
        <div class="goods-trigger">
            <button class="goods-add-wishlist ${wishlist.includes(id)? 'active':''}" data-goods-id="${id}"
             data-goods-id="${id}"></button>
            <button class="goods-delete" data-goods-id="${id}"></button>
        </div>
        <div class="goods-count">${goodsBasket[id]}</div>
    </div>`

return cart;

};

const renderCart=(items)=>{
    cartWrapper.textContent='';
    

        if(items.length){
            items.forEach((item) => {
        const {id, title,price,imgMin}=item;// Диструктаризация
        cartWrapper.appendChild(createCartGoods(id, title, price, imgMin))
    });
        }else{
            cartWrapper.innerHTML =`<div id="cart-empty">
            Ваша корзина пока пуста
        </div>`
        }

}



 cartBtn.addEventListener('click', openCart);
 cart.addEventListener('click', closeCart);
 category.addEventListener('click',choiceCategory)
 search.addEventListener('submit',searchGoods)
 goodsWrapper.addEventListener('click', handlerGoods)
 wishlistBtn.addEventListener('click', showWishlist)
 getGoods(renderCard,randomSort);

 storegeQuery(true);
 cookieQuery(true);






















})