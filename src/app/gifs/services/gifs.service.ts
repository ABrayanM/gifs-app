import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'K19W0mYrDYldxbMmuSQXnk0q04SBzJcM';
  private serviceUrl: string = 'http://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient ) {
    this.loadLocalStorage();
    console.log('Gifs Service Ready');
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    // toLowerCase = convierte el contenido de la variable tag a minúsculas y lo asigna nuevamente a la misma variable tag.
    tag = tag.toLowerCase();
    // includes = Verifica si el tag ya está presente en el historial de tags
    if ( this._tagsHistory.includes(tag) ) {
      // filter = crea un nuevo array con una funcion donde compara que el tag que se quiere guardar en el array, sea diferente al oldtag
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag )
    }
    // unshift = agrega el nuevo tag guardado al inicio del array
    this._tagsHistory.unshift( tag );
    // splice = es un metodo del array que crea un nuevo array con todo
    this._tagsHistory =this.tagsHistory.splice(0,10);
    this.saveLocalStorage();

  }

  // Metodo para guardar el tagHistory en el local Storage
  private saveLocalStorage():void {
    localStorage.setItem('history', JSON.stringify( this._tagsHistory ));
  }

  //Metodo para cargar lo que se guardo en el local storage
  private loadLocalStorage():void {
    if (!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse( localStorage.getItem('history')! );
    if ( this._tagsHistory.length === 0) return;
    this.searchTag( this._tagsHistory[0] );
  }

  // METODO PARA BUSCAR EL TAG
  searchTag( tag: string):void {
    // LENGTH = Verifica si la longitud del string tag es 0, si es asi, da por terminada la funcion !
    if ( tag.length === 0 ) return;
    // Llama al metodo organizeHistory con el parametro tag que recibira del
    this.organizeHistory(tag);

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`,{ params })
    .subscribe( resp => {

      this.gifList = resp.data;

      // console.log({ gifs: this.gifList })
    } );

  }



}
