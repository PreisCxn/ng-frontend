import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Location, NgClass, NgIf} from '@angular/common';
import lottie, {AnimationItem} from "lottie-web";
import {Optional} from "../../shared/optional";
import {SpinnerComponent} from "../../spinner/spinner.component";
import {PathUtil} from "../../shared/path-util";

export class AnimationType {
  private url: string = "";
  private imgIndex: number[] = [];

  constructor(url: string, imgIndex: number[] = [1]) {
    this.url = url;
    this.imgIndex = imgIndex;
  }

  public static TREASURECHEST_GOLD = new AnimationType("/");
  public static TREASURECHEST_SILVER = new AnimationType("/");
  public static TREASURECHEST_WOOD = new AnimationType("/");
  public static CRAFTING = new AnimationType("crafting/data", [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
  public static SMELTING = new AnimationType("/");
  public static TEST = new AnimationType("test/data", [1]);
  public static TEST2 = new AnimationType("crafting/data", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  getImgIndex(): number[] {
    return this.imgIndex;
  }

  toString(): string {
    return this.url;
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

  public static createCraftingData(data: [number, string][]): AnimationCraftingData {
    if(data.length > 9)
      throw new Error("Crafting data can only have 9 elements");
    if(data.some(([index, _]) => index < 0 || index > 8))
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

  public static createEmptyCraftingData(): AnimationCraftingData {
    return [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
  }

  public addSmeltingData(data: (string | null), index: number): AnimationDataBuilder {
    if (!this.data.smelting)
      this.data.smelting = [];

    this.data.smelting[index] = data;

    return this;
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
}

export type AnimationCraftingData = [
  [string | null, string | null, string | null],
  [string | null, string | null, string | null],
  [string | null, string | null, string | null]
]

export type AnimationData = {
  imageUrl: string,
  imageFolder?: string[],
  crafting?: AnimationCraftingData[],
  smelting?: (string | null)[],
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
export class CustomAnimComponent {

  @Input("useData") animData: AnimationData | AnimationDataBuilder | null = null;
  @Input("animType") type: AnimationType | AnimationType[] | null = null;

  @ViewChild('ele') animEle: ElementRef | null = null;

  private animation: Optional<AnimationItem> = Optional.empty();
  private animationQueue: AnimationType[] = [];
  private currentAnimationIndex: number = 0;
  private animationData: Optional<AnimationData> = Optional.empty();

  private static readonly rootToAssets = "../../../assets";

  protected isLoading: boolean = false;

  constructor(private location: Location) {
  }

  private loadAnimation() {
    if (this.isLoading) return;
    if (!this.animData) return;
    if (!this.animEle) return;
    if (!this.type) return;

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
    this.loadNextAnimation().then();
  }

  private async loadNextAnimation() {
    if (this.animation.isPresent())
      this.animation.get().destroy();
    this.isLoading = true;
    if (!this.animData) return;
    const type = this.animationQueue[this.currentAnimationIndex];

    const animData: AnimationData | null = this.animData instanceof AnimationDataBuilder ? this.animData.build() : this.animData;

    try {
      const data: any = await this.loadJson(type.toString());

      // Create a deep copy of the data
      const dataCopy = JSON.parse(JSON.stringify(data));

      const imageFolder: string = animData.imageFolder && animData.imageFolder[this.currentAnimationIndex] ?
        animData.imageFolder[this.currentAnimationIndex] :
        AnimationDataBuilder.DEFAULT_IMAGE_FOLDER
      ;

      if (this.type == null) throw new Error("Animation type is null");

      const defaultU = `assets/anims/${PathUtil.getDirectory(type.toString())}${imageFolder}`

      console.log(defaultU);


      dataCopy.assets.forEach((asset: any, index: number) => {
        asset.u = defaultU;
      });


      let count = -1;
      type.getImgIndex().forEach((index: number) => {
        count++;

        if(animData.crafting && animData.crafting[this.currentAnimationIndex] && count < 9) {

          const craftingData = animData.crafting[this.currentAnimationIndex];

          const craftingIndex = count % 9;
          const craftingRow = Math.floor(craftingIndex / 3);
          const craftingCol = craftingIndex % 3;

          if(!craftingData[craftingRow][craftingCol]) {
            dataCopy.assets[index].u = defaultU;
            dataCopy.assets[index].p = "empty.png";
          } else {
            dataCopy.assets[index].u = '';
            dataCopy.assets[index].p = craftingData[craftingRow][craftingCol];
          }

          return;
        }


        if(animData.imageUrl) {
          dataCopy.assets[index].u = '';
          dataCopy.assets[index].p = animData.imageUrl;
        }

      });


      // Load the animation with the modified data

      this.setupAnimation(dataCopy);

    } catch (error) {
      console.error(`Could not load module from path: ${type.toString()}`, error);
    }
  }

  private setupAnimation(dataCopy: any) {

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
      console.log("test")
      this.isLoading = false;
      this.animation.get().play();
    });

    // Listen for the animation complete event
    this.animation.get().addEventListener('complete', () => {
      console.log('Animation complete');
      // Increment the current animation index and loop back to the start if necessary
      this.currentAnimationIndex = (this.currentAnimationIndex + 1) % this.animationQueue.length;

      console.log(this.currentAnimationIndex);

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
    if(this.animation.isEmpty()) return;
    this.animation.get().goToAndStop(0, true);
  }

}
