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


const handleSearchFormSubmit = async (event) => {


  event.preventDefault();
 
  galleryWrapperEl.innerHTML = '';
 
  hideButtonLoadMore();
   
     if (!inputEl.value.trim()) {


    Notiflix.Notify.failure(


            '❌  Please enter data to search!')
   
    return;
  }
 
   pixabayInstance.q = inputEl.value;

   inputEl.value = '';

  try {
    const result = await pixabayInstance.fetchImages(); //then( data  => {
   
    console.log(result);

     galleryWrapperEl.innerHTML = createMarkupImages(result.hits);

       showButtonLoadMore();
                           
       lightbox.refresh();
   
    if (result.totalHits === 0) {

      hideButtonLoadMore();
       galleryWrapperEl.innerHTML = createMarkupImages(result.hits);
       
        Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');

        galleryWrapperEl.innerHTML = '';

        return;
     
       }
     
       
    if (result.totalHits < pixabayInstance.per_page) {
         
      galleryWrapperEl.innerHTML = createMarkupImages(result.hits);
      lightbox.refresh();
              
         Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        
         return buttonLoadMoreEl.classList.add('is-hidden');
                              
       }
                     
     }
     
  catch (error) {
    
    Notiflix.Notify.failure(error.message);

     }

};


               //       ПАГІНАЦІЯ


const handleLoadMoreButtonClick = async () => {
   
  pixabayInstance.page += 1;

  hideButtonLoadMore();

  const data = await pixabayInstance.fetchImages();
  try {
         galleryWrapperEl.insertAdjacentHTML('beforeend', createMarkupImages(data.hits));

     lightbox.refresh();

     showButtonLoadMore()
                          
     
     const totalPages = Math.ceil(data.totalHits / pixabayInstance.per_page);


     if (pixabayInstance.page >= totalPages) {
       
       Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
       galleryWrapperEl.insertAdjacentHTML('beforeend', createMarkupImages(data.hits));
       lightbox.refresh();
       hideButtonLoadMore();
       return;
     }
      }
                     
      
    catch (error) {
    
    Notiflix.Notify.failure(error.message);

     }

}

function showButtonLoadMore() {
     buttonLoadMoreEl.classList.remove('is-hidden');
 }

function hideButtonLoadMore() {
  buttonLoadMoreEl.classList.add('is-hidden');
}


searchFormEl.addEventListener('submit', handleSearchFormSubmit);
buttonLoadMoreEl.addEventListener('click', handleLoadMoreButtonClick);
