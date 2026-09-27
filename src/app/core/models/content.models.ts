export interface ItemDto {
    id: number;
    key: string;
    order: number;
    title?: string;
    subTitle?: string;
    description?: string;
    imagePath?: string;
    icon?: string;
    link?: string;
  }
  
  export interface BlockDto {
    id: number;
    key: string;
    type?: string;
    order: number;
    icon?: string;
    isFeatured: boolean;
    title?: string;
    subTitle?: string;
    description?: string;
    imagePath?: string;
    link?: string;
    items: ItemDto[];
  }
  
  export interface SectionDto {
    id: number;
    key: string;
    type?: string;
    order: number;
    title?: string;
    subTitle?: string;
    description?: string;
    blocks: BlockDto[];
  }