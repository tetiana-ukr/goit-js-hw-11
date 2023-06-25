export class pixabayAPI {
    #API_KEY = '37638988-b8b2c5fb5f9f39284380c33c6';
    #BASE_URL = 'https://pixabay.com/api/';

    q = null;
    page = 1;
    per_page = 40;


    fetchImages() {
       
        return fetch(`${this.#BASE_URL}?key=${this.#API_KEY}&q=${this.q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}`)
    .then(res => {
             
        if (!res.ok) {
            throw new Error(res.status);
        }
       
        return res.json();
 })
        //.then(console.log)    
       // .catch(error => {
           
        //    console.warn(error);
       // });
    }
}


