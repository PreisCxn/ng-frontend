import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {isPlatformBrowser, NgClass, NgIf} from '@angular/common';
import lottie, {AnimationItem} from "lottie-web";
import {Optional} from "../../shared/optional";
import {SpinnerComponent} from "../../spinner/spinner.component";
import {PathUtil} from "../../shared/path-util";
import {isItemInfo, ItemInfo} from "../../shared/types/item.types";

export type AnimationCraftingData = [
  [string | null, string | null, string | null],
  [string | null, string | null, string | null],
  [string | null, string | null, string | null]
]

export type AnimationSmeltingData = [
  [string | null],
]

export type AnimationData = {
  imageUrl: string,
  imageFolder?: string[],
  crafting?: AnimationCraftingData[],
  smelting?: AnimationSmeltingData[],
}

export type ItemAnimationData = {
  type: AnimationTypeKey,
  imageFolger?: string,
  data?: [number, string][],
}

export type AnimationTypeKey = keyof typeof AnimationType.TYPES;

export class AnimationType {
  private url: string = "";
  private imgIndex: number[] = [];
  private needData: boolean = false;

  constructor(url: string, imgIndex: number[] = [1], needData: boolean = false) {
    this.url = url;
    this.imgIndex = imgIndex;
    this.needData = needData;
  }

  public static readonly TREASURECHEST_CHRISTMAS = new AnimationType("chests/christmas/data", [1], false);
  public static readonly TREASURECHEST_EASTER = new AnimationType("chests/easter/data", [1], false);
  public static readonly TREASURECHEST_FURNITURE = new AnimationType("chests/furniture/data", [1], false);
  public static readonly TREASURECHEST_GOLD = new AnimationType("chests/gold/data", [1], false);
  public static readonly TREASURECHEST_HALLOWEEN = new AnimationType("chests/halloween/data", [1], false);
  public static readonly TREASURECHEST_HAT = new AnimationType("chests/hat/data", [1], false);
  public static readonly TREASURECHEST_SKIN = new AnimationType("chests/skin/data", [1], false);
  public static readonly TREASURECHEST_SUMMER = new AnimationType("chests/summer/data", [1], false);
  public static readonly TREASURECHEST_VALENTINE = new AnimationType("chests/valentine/data", [1], false);
  public static readonly TREASURECHEST_WOOD = new AnimationType("chests/wood/data", [1], false);
  public static readonly NOOK = new AnimationType("nook/data", [0]);
  public static readonly CRAFTING = new AnimationType("crafting/data", [10, 9, 8, 7, 6, 5, 4, 3, 2, 1], true);
  public static readonly SMELTING = new AnimationType("smelting/data", [2, 1], true);

  public static TYPES: { [key: string]: AnimationType } = {
    "pcxn.item-anim.treasurechest-christmas": AnimationType.TREASURECHEST_CHRISTMAS,
    "pcxn.item-anim.treasurechest-easter": AnimationType.TREASURECHEST_EASTER,
    "pcxn.item-anim.treasurechest-furniture": AnimationType.TREASURECHEST_FURNITURE,
    "pcxn.item-anim.treasurechest-gold": AnimationType.TREASURECHEST_GOLD,
    "pcxn.item-anim.treasurechest-halloween": AnimationType.TREASURECHEST_HALLOWEEN,
    "pcxn.item-anim.treasurechest-hat": AnimationType.TREASURECHEST_HAT,
    "pcxn.item-anim.treasurechest-skin": AnimationType.TREASURECHEST_SKIN,
    "pcxn.item-anim.treasurechest-summer": AnimationType.TREASURECHEST_SUMMER,
    "pcxn.item-anim.treasurechest-valentine": AnimationType.TREASURECHEST_VALENTINE,
    "pcxn.item-anim.treasurechest-wood": AnimationType.TREASURECHEST_WOOD,
    "pcxn.item-anim.nook": AnimationType.NOOK,
    "pcxn.item-anim.crafting": AnimationType.CRAFTING,
    "pcxn.item-anim.smelting": AnimationType.SMELTING,
  }

  getImgIndex(): number[] {
    return this.imgIndex;
  }

  toString(): string {
    return this.url;
  }

  doNeedData(): boolean {
    return this.needData;
  }

  public static getFromItemAnimationData(data: ItemAnimationData[]): AnimationType[] {
    return data.map(item => {
      if (!(item.type in AnimationType.TYPES)) {
        console.error(`AnimationType ${item.type} does not exist`);
        throw new Error(`AnimationType ${item.type} does not exist`);

      }
      return AnimationType.TYPES[item.type];
    });
  }

}

export class AnimationDataBuilder {

  public static DEFAULT_IMAGE_FOLDER = "/images/";

  private data: AnimationData = {
    imageUrl: "",
    imageFolder: []
  };

  public setImageUrl(url: string): AnimationDataBuilder {
    this.data.imageUrl = url;
    return this;
  }

  public addCraftingData(data: AnimationCraftingData, index: number): AnimationDataBuilder {

    if (!this.data.crafting)
      this.data.crafting = [];

    this.data.crafting[index] = data;

    return this;
  }

  public addSmeltingData(data: AnimationSmeltingData, index: number): AnimationDataBuilder {
    if (!this.data.smelting)
      this.data.smelting = [];

    this.data.smelting[index] = data;

    return this;
  }

  public static createCraftingData(data: [number, string][]): AnimationCraftingData {
    if (data.length > 9)
      throw new Error("Crafting data can only have 9 elements");
    if (data.some(([index, _]) => index < 0 || index > 8))
      throw new Error("Crafting data index must be between 0 and 8");

    const result = AnimationDataBuilder.createEmptyCraftingData();

    data.forEach(([index, path]) => {
      const invertedIndex = 8 - index;
      const row = Math.floor(invertedIndex / 3);
      const col = invertedIndex % 3;

      result[row][col] = path;
    });

    return result;
  }

  public static createSmeltingData(data: [number, string][]): AnimationSmeltingData {
    if (data.length > 1)
      throw new Error("Smelting Data can only contains 1 element");

    const result: AnimationSmeltingData = [[null]];

    data.forEach(([index, path]) => {
      result[0][0] = path;
    });

    return result;
  }

  public static createEmptyCraftingData(): AnimationCraftingData {
    return [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
  }

  //relativ vom Ordner wo die json drin liegt
  public addImageFolder(folder: string, index: number): AnimationDataBuilder {

    if (this.data.imageFolder) {
      this.data.imageFolder[index] = folder + "/";
    }

    return this;
  }

  static create(imageUrl: string | undefined): AnimationDataBuilder {
    return new AnimationDataBuilder()
      .setImageUrl(imageUrl ? imageUrl : "")
  }

  public build(): AnimationData {
    return this.data;
  }

  public static getFromItemAnimationData(imageUrl: string, animData: ItemAnimationData[]): [AnimationType[], AnimationDataBuilder] {
    const builder = AnimationDataBuilder.create(imageUrl);

    const animTypes = AnimationType.getFromItemAnimationData(animData);

    animTypes.forEach((type, index) => {
      if (type.doNeedData()) {
        if (!animData[index].data || !Array.isArray(animData[index].data)) {
          throw new Error(`AnimationType ${type.toString()} needs data`);
        }

        const data = animData[index].data as [number, string][];

        switch (type) {
          case AnimationType.CRAFTING:
            builder.addCraftingData(AnimationDataBuilder.createCraftingData(data), index);
            break;
          case AnimationType.SMELTING:
            builder.addSmeltingData(AnimationDataBuilder.createSmeltingData(data), index);
            break;
          default:
            break;
        }

      } else {
        const imgFolder = animData[index].imageFolger;
        if (imgFolder) {
          builder.addImageFolder(imgFolder, index);
        }
      }
    });


    return [animTypes, builder];
  }

  public static getBuilderFromItemAnimationData(imageUrl: string, data: ItemAnimationData[]): AnimationDataBuilder {
    return AnimationDataBuilder.getFromItemAnimationData(imageUrl, data)[1];
  }

}

@Component({
  selector: 'section-custom-anim',
  standalone: true,
  imports: [
    SpinnerComponent,
    NgIf,
    NgClass
  ],
  templateUrl: './custom-anim.component.html',
  styleUrl: './custom-anim.component.scss'
})
export class CustomAnimComponent implements OnInit {


  @Input("useData") data: AnimationData | AnimationDataBuilder | ItemInfo | null = null;
  @Input("animType") type: AnimationType | AnimationType[] | null = null;

  @ViewChild('ele') animEle: ElementRef | null = null;

  private animation: Optional<AnimationItem> = Optional.empty();
  private animationQueue: AnimationType[] = [];
  private currentAnimationIndex: number = 0;
  private animData: AnimationData | AnimationDataBuilder | null = null;

  protected isLoading: boolean = false;
  protected isInitialized: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {

  }

  ngOnInit(): void {
    if (isItemInfo(this.data)) {
      const [animTypes, builder] = AnimationDataBuilder.getFromItemAnimationData(this.data.imageUrl, this.data.animationData ? this.data.animationData : []);
      this.animData = builder;
      this.type = animTypes;
    } else {
      this.animData = this.data ? isItemInfo(this.data) ? AnimationDataBuilder.getBuilderFromItemAnimationData(this.data.imageUrl, this.data.animationData ? this.data.animationData : []) : this.data : null;
    }
  }

  private loadAnimation() {
    if (this.isLoading) return;
    if (!this.animData) return;
    if (!this.animEle) return;
    if (!this.type) return;

    if (Array.isArray(this.animData) && this.animData.length <= 0) {
      return;
    }

    if (Array.isArray(this.type) && this.type.length <= 0) {
      return;
    }

    if (Array.isArray(this.type)) {
      this.animationQueue = this.type;
    } else {
      this.animationQueue = [this.type];
    }

    this.loadNextAnimationSync();
  }

  async loadJson(path: string) {
    try {
      return await import(`../../../assets/anims/${path}.json`);
    } catch (error) {
      console.error(`Could not load Anim: /assets/anims/${path}.json`, error);
      throw error;
    }
  }

  private loadNextAnimationSync() {
    this.loadNextAnimation().then(() => {
    });
  }

  private async loadNextAnimation() {
    /*
    if (this.animation.isPresent())
      this.animation.get().destroy();

     */
    this.isLoading = true;
    if (!this.animData) return;
    const type = this.animationQueue[this.currentAnimationIndex];

    const animData: AnimationData | null =
      this.animData instanceof AnimationDataBuilder ? this.animData.build() : this.animData;

    try {
      const data: any = await this.loadJson(type.toString());

      // Create a deep copy of the data
      const dataCopy = JSON.parse(JSON.stringify(data));

      const imageFolder: string = animData.imageFolder && animData.imageFolder[this.currentAnimationIndex] ?
        animData.imageFolder[this.currentAnimationIndex] :
        AnimationDataBuilder.DEFAULT_IMAGE_FOLDER
      ;

      const defaultU = `assets/anims/${PathUtil.getDirectory(type.toString())}${imageFolder}`


      dataCopy.assets.forEach((asset: any) => {
        asset.u = defaultU;
      });


      let count = -1;
      type.getImgIndex().forEach((index: number) => {
        count++;

        if (animData.crafting && animData.crafting[this.currentAnimationIndex] && count < 9) {

          const craftingData = animData.crafting[this.currentAnimationIndex];

          const craftingIndex = count % 9;
          const craftingRow = Math.floor(craftingIndex / 3);
          const craftingCol = craftingIndex % 3;

          if (!craftingData[craftingRow][craftingCol]) {
            dataCopy.assets[index].u = defaultU;
            dataCopy.assets[index].p = "empty.png";
          } else {
            dataCopy.assets[index].u = '';
            dataCopy.assets[index].p = craftingData[craftingRow][craftingCol];
          }

          return;
        }

        if (animData.smelting && animData.smelting[this.currentAnimationIndex] && count === 1) {
          const smeltingData = animData.smelting[this.currentAnimationIndex];

          if (!smeltingData[0][0]) {
            dataCopy.assets[index].u = defaultU;
            dataCopy.assets[index].p = "empty.png";
          } else {
            dataCopy.assets[index].u = '';
            dataCopy.assets[index].p = smeltingData[0][0];
          }

          return;
        }


        if (animData.imageUrl) {
          dataCopy.assets[index].u = '';
          dataCopy.assets[index].p = animData.imageUrl;
        }

      });


      // Load the animation with the modified data

      if (this.animation.isPresent())
        this.animation.get().destroy();

      this.setupAnimation(dataCopy);

    } catch (error) {
      console.error(`Could not load module from path: ${type.toString()}`, error);
    }
  }

  private setupAnimation(dataCopy: any) {
    if (!isPlatformBrowser(this.platformId)) return;

    console.log("setupAnim")


    const animation = lottie.loadAnimation({
      container: this.animEle?.nativeElement,
      renderer: 'svg',
      loop: this.animationQueue.length == 1,
      autoplay: false,
      animationData: dataCopy,
    });

    this.animation = Optional.of(animation);

    this.animation.get().addEventListener('DOMLoaded', () => {
      this.isLoading = false;
    });

    this.animation.get().addEventListener('loaded_images', () => {
      this.isLoading = false;
      if (!this.isInitialized)
        this.isInitialized = true;
      this.animation.get().play();
    });

    // Listen for the animation complete event
    this.animation.get().addEventListener('complete', () => {
      // Increment the current animation index and loop back to the start if necessary
      this.currentAnimationIndex = (this.currentAnimationIndex + 1) % this.animationQueue.length;

      // Load the next animation
      this.loadNextAnimationSync();
    });

  }

  public play() {
    if (this.animation.isEmpty()) {
      this.loadAnimation();
    } else
      this.animation.get().play();
  }

  public pause() {
    if (this.animation.isEmpty()) return;
    this.animation.get().pause();
  }

  public reset() {
    this.pause();
    if (this.animation.isEmpty()) return;
    this.animation.get().goToAndStop(0, true);
  }

  public reload() {
    this.reset();

    if(this.animation.isPresent())
      this.animation.get().destroy();
    this.animation = Optional.empty();
    this.animationQueue = [];
    this.currentAnimationIndex = 0;
    this.animData = null;

    this.isLoading = false;
    this.isInitialized = false;


    if (isItemInfo(this.data)) {
      const [animTypes, builder] = AnimationDataBuilder.getFromItemAnimationData(this.data.imageUrl, this.data.animationData ? this.data.animationData : []);
      this.animData = builder;
      this.type = animTypes;
    } else {
      this.animData = this.data ? isItemInfo(this.data) ? AnimationDataBuilder.getBuilderFromItemAnimationData(this.data.imageUrl, this.data.animationData ? this.data.animationData : []) : this.data : null;
    }
    this.loadAnimation();
  }

  public getIsInitialized(): boolean {
    return this.isInitialized;
  }

}
