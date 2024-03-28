import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {
  AnimationCraftingData,
  AnimationData,
  AnimationDataBuilder,
  AnimationType, AnimationTypeKey, CustomAnimComponent,
  ItemAnimationData
} from "../../../../section/custom-anim/custom-anim.component";
import {NgForOf, NgIf} from "@angular/common";
import {AdminItemDataComponent} from "../../item/adminItemData.component";

@Component({
  selector: 'app-animation-editor',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    CustomAnimComponent,
    NgIf
  ],
  templateUrl: './animation-editor.component.html',
  styleUrl: './animation-editor.component.scss'
})
export class AnimationEditorComponent {
  @ViewChild('content') content: any;
  @ViewChild('animation') animationComponent: CustomAnimComponent | null = null;

  @Output() animationChange = new EventEmitter<ItemAnimationData[]>();
  @Input('imgUrl') imgUrl: string = '';
  @Input('data') allAnimations: ItemAnimationData[] = [];

  animationType: AnimationTypeKey = "";
  animationTypeDetails: AnimationType | undefined = AnimationType.TYPES[this.animationType];
  animation: ItemAnimationData | null = null;
  animationData: [number, string][] | null = null;
  imgFolder: string = "";

  protected editIndex: number | null = null;

  craftingData: [(number | string)[][], (number | string)[][], (number | string)[][]] = [
    [[0, ""], [1, ""], [2, ""]],
    [[3, ""], [4, ""], [5, ""]],
    [[6, ""], [7, ""], [8, ""]],
  ];

  smeltingData: [(number | string)[]] = [
    [0, ""]
  ];

  protected types = AnimationType.TYPES;

  constructor(private modalService: NgbModal) {
  }

  open() {
    this.modalService.open(this.content);
  }

  saveAnimation() {
    if (!this.animationType) return;

    this.animation = {
      type: this.animationType
    }

    if (this.imgFolder !== "") {
      this.animation.imageFolger = this.imgFolder;
    }

    if(this.isCrafting()) {
      this.animationData = this.convertCraftingData(this.craftingData);
      this.animation.data = this.animationData;
    }

    if(this.isSmelting()) {
      this.animationData = this.convertSmeltingData(this.smeltingData);
      this.animation.data = this.animationData;
    }

    if (this.editIndex !== null) {
      this.allAnimations[this.editIndex] = this.animation;
      this.editIndex = null; // Reset editIndex
    } else {
      this.allAnimations.push(this.animation);
    }

    this.reload(true);


    this.modalService.dismissAll();
    this.animationChange.emit(this.allAnimations);
  }

  public reload(delay: boolean = false) {
    setTimeout(() => {
      if (this.animationComponent) {
        this.animationComponent.reload();
      }
    }, delay ? 100 : 0);
  }

  deleteAnimation(index: number) {
    this.allAnimations.splice(index, 1);
    this.reload(true);

    this.animationChange.emit(this.allAnimations);
  }

  addAnimation() {
    this.animationType = "";
    this.open();
  }

  editAnimation(index: number) {
    const animation = this.allAnimations[index];
    this.animationType = animation.type;

    if(this.hasAnimationData(index)) {
      if(this.isCrafting()) {
        this.craftingData = this.revertCraftingData(animation.data as [number, string][]);
      }
      if(this.isSmelting()) {
        this.smeltingData = this.revertSmeltingData(animation.data as [number, string][]);
      }
    }

    this.editIndex = index;

    this.open();

    this.animationChange.emit(this.allAnimations);
  }

  hasAnimationData(index: number) {
    return this.allAnimations[index].data !== undefined;
  }

  isCrafting() {
    return AnimationType.TYPES[this.animationType] === AnimationType.CRAFTING;
  }

  isSmelting() {
    return AnimationType.TYPES[this.animationType] === AnimationType.SMELTING;
  }

  private convertCraftingData(craftingData: [(number | string)[][], (number | string)[][], (number | string)[][]]): [number, string][] {
    let result: [number, string][] = [];
    for (let row of craftingData) {
      for (let item of row) {
        if (item[1] !== "") {
          result.push([item[0] as number, AdminItemDataComponent.getImgUrl(item[1] as string)]);
        }
      }
    }
    return result;
  }

  private convertSmeltingData(smeltingData: [(number | string)[]]): [number, string][] {
    let result: [number, string][] = [];
    for (let data of smeltingData) {
      result.push([data[0] as number, AdminItemDataComponent.getImgUrl(data[1] as string)]);
    }
    return result;
  }

  private revertCraftingData(data: [number, string][]): [(number | string)[][], (number | string)[][], (number | string)[][]] {
    let result: [(number | string)[][], (number | string)[][], (number | string)[][]] = [
      [[0, ""], [1, ""], [2, ""]],
      [[3, ""], [4, ""], [5, ""]],
      [[6, ""], [7, ""], [8, ""]],
    ];

    for (let item of data) {
      let index = item[0] as number;
      let value = item[1] as string;
      let rowIndex = Math.floor(index / 3);
      let colIndex = index % 3;
      result[rowIndex][colIndex] = [index, value];
    }

    return result;
  }

  private revertSmeltingData(data: [number, string][]): [(number | string)[]] {
    let result: [(number | string)[]] = [
      [0, ""]
    ];

    for (let item of data) {
      let index = item[0] as number;
      let value = item[1] as string;
      result[index] = [index, value];
    }

    return result;
  }

  protected readonly Object = Object;
  protected readonly AnimationDataBuilder = AnimationDataBuilder;
  protected readonly AnimationType = AnimationType;
}
