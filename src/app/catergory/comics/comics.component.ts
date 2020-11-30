import { Component, ElementRef, OnInit, ViewChild,Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarvelService } from 'src/app/services/marvel.service';
import { CardDetails } from 'src/app/services/models/Marvel';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-comics',
  templateUrl: './comics.component.html',
  styleUrls: ['./comics.component.css']
})
export class ComicsComponent implements OnInit {
  @ViewChild('cardRow',{static:false}) cardRow: ElementRef;

  comicsPanelOpenState = true;
  comicsCardDetails:CardDetails []=[];
  comicsTotal:string='';
  comicsSeeAllIsEnabled = false;
  
  constructor(private _marvelService:MarvelService,
    private router:Router,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private _document
    ) {
  this.getAllComics();
  }

  ngOnInit(): void {
    this._document.body.classList.add('bodybg-color');
    // OR you can Add inline style css with the help of code below
    // this._document.body.style.background = '#fff';
}
  ngOnDestroy() {
  
    this._document.body.classList.remove('bodybg-color');
  }
  getAllComics() {
    this._marvelService.getAllComics().subscribe((data:any)=>{
      // if(data?.results){
        let comics =data.data.results;
        this.comicsTotal=data.data.total;
        comics.forEach(item => {
         this.comicsCardDetails.push({
           id:item.id,
           name:item.title,
           description:item.description,
           comicsAvailable:item.comics?.available,
           seriesAvailable:item.series?.available,
           eventsAvailable:item.events?.available,
           storiesAvailable:item.stories?.available,
           thumbnail:item.thumbnail.path+'.'+item.thumbnail.extension,
          })
        });

      // }
    })
  }

  goToDetailCard(cardObj) {
    console.log(cardObj);
    let name=cardObj.name.replace(/\s/g, '');
    this.router.navigate([`/comics/${name}/${cardObj.id}`])
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    const url = this.route.snapshot.url[0].path;
    console.log(url);
    if(url==='comics'){
      this.comicsSeeAllIsEnabled=true;
      this.cardRow.nativeElement.classList.remove("card-row");
    }
  }
  
  togglePanel() {
    this.comicsPanelOpenState = !this.comicsPanelOpenState;
  }
}
