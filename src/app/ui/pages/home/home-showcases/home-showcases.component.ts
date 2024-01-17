import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { ReplaySubject, takeUntil, startWith, map, scan, distinctUntilChanged, takeWhile, switchMap, Observable } from 'rxjs';
import { TRANSITION_TEXT, TRANSITION_IMAGE_SCALE } from 'src/app/ui/animations/transitions/transitions.constants';
import { UiUtilsView } from 'src/app/ui/utils/views.utils';

@Component({
  selector: 'app-home-showcases',
  templateUrl: './home-showcases.component.html',
  styleUrls: ['./home-showcases.component.scss'],
  animations: [
    TRANSITION_TEXT,
    TRANSITION_IMAGE_SCALE
  ]
})
export class HomeShowcasesComponent implements OnInit {

   readonly ICONS_2: string = "assets/img/icons/icon_set_2.png" 
   readonly ICONS_2_XS = "assets/img/icons/icon_set_2_xs.png" 
  
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  mOnceAnimated = false

  _mIcon2 = "assets/img/icons/icon_set_2.png"


  /* ********************************************************************************************
    *                anims
    */
  _mTriggerAnim?= 'false'



  _mThreshold = 0.2


  @ViewChild('animRefView') vAnimRefView?: ElementRef<HTMLElement>;

  constructor(public el: ElementRef,
    private _ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    public mediaObserver: MediaObserver,
    private scroll: ScrollDispatcher, private viewPortRuler: ViewportRuler,
    private formBuilder: FormBuilder) {
      this.mediaObserver.asObservable().subscribe((mediaChange: MediaChange[]) => {

        if (mediaChange.length > 0) {
  
          if (mediaChange[0].mqAlias == "xs") {
            // console.log("changes: ", mediaChange);
            this._mIcon2 = this.ICONS_2_XS
  
          }else{
            this._mIcon2 = this.ICONS_2
  
          }
        }
  
        // this.opened = this.getOpened(mediaChange);
      });
    

  }

  ngOnInit(): void {
  }



  ngAfterViewInit(): void {
    this.setupAnimation();
  }

  ngOnDestroy(): void {

    this.destroyed$.next(true)
    this.destroyed$.complete()
  }

  


  /* ***************************************************************************
   *                                  other parts
   */


  public setupAnimation() {
    if (!this.vAnimRefView) return;

    // console.info("home products setupAnimation: " )
    this.scroll.ancestorScrolled(this.vAnimRefView, 100).pipe(
      // Makes sure to dispose on destroy
      takeUntil(this.destroyed$),
      startWith(0),
      map(() => {
        if (this.vAnimRefView != null) {
          var visibility = UiUtilsView.getVisibility(this.vAnimRefView, this.viewPortRuler)
          // console.log("product app-item UiUtilsView visibility: ", visibility)
          return visibility;
        }
        return 0;

      }),
      scan<number, boolean>((acc: number | boolean, val: number) => (val >= this._mThreshold || (acc ? val > 0 : false))),
      // Distincts the resulting triggers 
      distinctUntilChanged(),
      // Stop taking the first on trigger when aosOnce is set
      takeWhile(trigger => {
        // console.info("app-item  !trigger || !this.mOnceAnimated",
        //   !trigger || !this.mOnceAnimated)

        return !trigger || !this.mOnceAnimated
      }, true),
      switchMap(trigger => new Observable<number | boolean>(observer => this._ngZone.run(() => observer.next(trigger))))
    ).subscribe(val => {


      // console.log("home-item setupAnimation ancestorScrolled: ", val)

      if (this.mOnceAnimated) {
        return;
      }

      if (val) {
        // console.log("HomeProductsComponent setupAnimation setupAnimation ancestorScrolled: ", val)

        this.mOnceAnimated = true
        this._mTriggerAnim = 'true'
        this.cdr.detectChanges()
      }
      // if (this.vImageArea != null) {
      //   var visibility = UiUtilsView.getVisibility(this.vImageArea, this.viewPortRuler)
      //   console.log("UiUtilsView visibility: ", visibility)
      // }
    }

    )
  }

  /* ************************************************************************************
   * 
   */

  _mClientApps = [

    {
     "id": "5131",
     "name": "PepPlus: For Academic Growth",
     "image": "assets/img/clients/pepplus.png",
     "link": "https://play.google.com/store/apps/details?id=com.pepstudy.pepplus",
     "tab": "Android",
     "color": "#FFFFFF"
   },


   {
     "id": "5132",
     "name": "WhichOne Shop: Amazon Flipkart",
     "image": "assets/img/clients/whichone.png",
     "link": "https://play.google.com/store/apps/details?id=com.whichone",
     "tab": "Flutter"
   },
   {
     "id": "5133",
     "name": "Aabboo - Anonymous Chat Rooms",
     "image": "assets/img/clients/aabboo.png",
     "link": "https://play.google.com/store/apps/details?id=com.aabboo.social",
     "tab": "Android"
   }
  ];

 

}
