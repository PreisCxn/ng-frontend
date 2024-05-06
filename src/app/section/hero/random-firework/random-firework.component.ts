import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {interval, Subject, Subscription} from "rxjs";
import {LottieComponent} from "../../lottie/lottie.component";
import {DeviceDetectorService} from "ngx-device-detector";
import {DataService} from "../../../shared/data.service";

@Component({
  selector: 'hero-random-firework',
  standalone: true,
  imports: [
    LottieComponent
  ],
  templateUrl: './random-firework.component.html',
  styleUrl: './random-firework.component.scss'
})
export class RandomFireworkComponent implements OnInit, AfterViewInit, OnDestroy {

  private intervalSubscription: Subscription | undefined = undefined;

  protected customImgs:string[] | undefined = undefined;

  private readonly randomItems = [
    DataService.getFromCDN('assets/img/items/cxn/general/items/design_templates/cactus_scroll.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/items/tom_block_coupon.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/items/treasure_chests/keys/default_key.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/indoor_furniture/royal/medievalroyal_chandelier.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/specialitems/minion_item.png', 64),
    DataService.getFromCDN('assets/img/items/mc/steal/blocks/RedstoneBlockNew.png', 64),
    DataService.getFromCDN('assets/img/items/mc/steal/blocks/Bee_Hive.png', 64),
    DataService.getFromCDN('assets/img/items/mc/steal/blocks/BlockOfDiamondNew.png', 64),
    DataService.getFromCDN('assets/img/items/mc/steal/blocks/IronBlockNew.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/skyblock/venditor_item.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/skyblock/item_storage.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/specialitems/player_shop.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/specialitems/image_map.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/specialitems/bounce_platform.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/specialitems/bottomless_bucket.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/specialitems/text_hologram.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/specialitems/hopper/blocking_hopper.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/specialitems/hopper/multihopper_neswd.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/specialitems/hopper/trash_hopper.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/specialitems/hopper/teleport_hopper.png', 64),
  ];

  private readonly defaultLightImg:string = 'assets/img/mod/anims/firework/images/img_0.png'; // 0, 9
  private readonly defaultFireworkImg:string = 'assets/img/mod/anims/firework/images/img_10.png'; // 10

  protected leftFireworkPlay = new Subject<void>();
  protected rightFireworkPlay = new Subject<void>();

  @ViewChild('leftFireworkContainer') leftFireworkContainer!: ElementRef;
  @ViewChild('rightFireworkContainer') rightFireworkContainer!: ElementRef;

  constructor(private renderer: Renderer2, private device: DeviceDetectorService) {
  }

  ngAfterViewInit(): void {
    if(this.device.isMobile()) return;
    this.playNextFirework();
    this.intervalSubscription = interval(this.getRandomInt(3000, 8000))
      .subscribe(() => this.playNextFirework());
  }

  ngOnDestroy(): void {
    this.leftFireworkPlay.unsubscribe();
    this.rightFireworkPlay.unsubscribe();
    if(this.intervalSubscription)
      this.intervalSubscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  private refreshCustomImgs(): void {
    let array = new Array(12).fill(null);
    let randomItemsCopy = [...this.randomItems];

    array[0] = this.defaultLightImg;
    array[9] = this.defaultLightImg;
    array[10] = this.defaultFireworkImg;
    array[8] = this.defaultFireworkImg;

    for (let i = 0; i < array.length; i++) {
      if (array[i] === null) {
        let randomIndex = Math.floor(Math.random() * randomItemsCopy.length);
        array[i] = randomItemsCopy[randomIndex];
        randomItemsCopy.splice(randomIndex, 1);
      }
    }

    this.customImgs = array;
  }

  private playNextFirework(): void {
    if(this.device.isMobile()) {
      this.intervalSubscription?.unsubscribe();
      return;
    }
    this.randomizeScale();
    this.refreshCustomImgs();
    this.randomizePosition();
    this.randomizeRotation();
    if (Math.random() < 0.5) {
      this.leftFireworkPlay.next();
    } else {
      this.rightFireworkPlay.next();
    }
  }

  private randomizeScale(): void {
    this.renderer.setStyle(this.leftFireworkContainer.nativeElement, 'scale', '' + this.getRandomInt(0.7, 1.2));
    this.renderer.setStyle(this.rightFireworkContainer.nativeElement, 'scale', '' + this.getRandomInt(0.7, 1.2));
  }

  private randomizePosition(): void {
    this.renderer.setStyle(this.leftFireworkContainer.nativeElement, 'left', this.getRandomInt(0, -20) + 'rem');
    this.renderer.setStyle(this.rightFireworkContainer.nativeElement, 'right', this.getRandomInt(0, -20) + 'rem');
  }

  private randomizeRotation(): void {
    this.renderer.setStyle(this.leftFireworkContainer.nativeElement, 'rotate', '' + this.getRandomInt(0, 15) + 'deg');
    this.renderer.setStyle(this.rightFireworkContainer.nativeElement, 'rotate', '' + this.getRandomInt(0, -15) + 'deg');

  }

  private getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
