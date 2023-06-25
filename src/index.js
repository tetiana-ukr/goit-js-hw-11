import { pixabayAPI } from './js/fetch-images';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


import Notiflix from 'notiflix';


const searchFormEl = document.querySelector('.search-form');
const galleryWrapperEl = document.querySelector('.gallery');
const buttonLoadMoreEl = document.querySelector('.load-more');



const pixabayInstance = new pixabayAPI();
const inputEl = searchFormEl.firstElementChild;
const lightbox = new SimpleLightbox('.gallery a', {
      captionDelay: 250,
      
    });

hideButtonLoadMore();
//buttonLoadMoreEl.classList.add('is-hidden');


function createMarkupImages(imagesMarkup) {


      if (!imagesMarkup) {


    Notiflix.Notify.failure(


            `❌Oops! Something went wrong! Try reloading the page!`
          );
 
  }
      return imagesMarkup.map((image) =>
         
     `
     <div class="photo-card">
     <a href='${image.largeImageURL}' class="gallery-link">
      <img src="${image.webformatURL}" alt="${image.tags}" class="gallery-image" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item"><b> Likes </b>${image.likes}
      </p>
    <p class="info-item"><b> Views </b>${image.views}
      </p>
    <p class="info-item"><b> Comments </b>${image.comments}
      </p>
    <p class="info-item"><b> Downloads </b>${image.downloads}
       </p>
  </div>
</div>`).join('');
};



const handleSearchFormSubmit = event => {

    event.preventDefault();
 
  galleryWrapperEl.innerHTML = '';
  
  hideButtonLoadMore();
   
    //buttonLoadMoreEl.classList.add('is-hidden');


  if (!inputEl.value.trim()) {

    Notiflix.Notify.failure(

            '❌  Please enter data to search!')
   
    return;
  }
 
   pixabayInstance.q = inputEl.value;

   inputEl.value = '';

     pixabayInstance.fetchImages().then( data  => {
   
    console.log(data);
   
    if (data.totalHits === 0) {

      hideButtonLoadMore();
        //buttonLoadMoreEl.classList.add('is-hidden');

        Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');

        galleryWrapperEl.innerHTML = '';


      return;
     
       }
      
       
       if (data.totalHits < pixabayInstance.per_page) {
       
         buttonLoadMoreEl.classList.add('is-hidden');

         galleryWrapperEl.innerHTML = createMarkupImages(data.hits);
         Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
          lightbox.refresh();           
           return;   
       
       }
      // hideButtonLoadMore();
                 
       galleryWrapperEl.innerHTML = createMarkupImages(data.hits);

       showButtonLoadMore();
       //buttonLoadMoreEl.classList.remove('is-hidden');
                      
       lightbox.refresh();

    })
    .catch(console.warn);
};

               //       ПАГІНАЦІЯ 

const handleLoadMoreButtonClick = () => {
   
  pixabayInstance.page += 1;

    hideButtonLoadMore();

 //  buttonLoadMoreEl.classList.add('is-hidden');
 
   pixabayInstance.fetchImages()
   .then(data => {
         
     console.log(pixabayInstance.page)

     const totalPages = Math.ceil(data.totalHits / pixabayInstance.per_page);

     if (pixabayInstance.page === totalPages) {
       
       Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
       galleryWrapperEl.insertAdjacentHTML('beforeend', createMarkupImages(data.hits));
       lightbox.refresh();
       hideButtonLoadMore();
       return;
     }

     galleryWrapperEl.insertAdjacentHTML('beforeend', createMarkupImages(data.hits));

     showButtonLoadMore()
           
     lightbox.refresh();
     
               
      })
 
    .catch(console.warn);


}

function showButtonLoadMore() {
  buttonLoadMoreEl.classList.remove('is-hidden');
  
}

function hideButtonLoadMore() {
  buttonLoadMoreEl.classList.add('is-hidden');
}


searchFormEl.addEventListener('submit', handleSearchFormSubmit);
buttonLoadMoreEl.addEventListener('click', handleLoadMoreButtonClick);



