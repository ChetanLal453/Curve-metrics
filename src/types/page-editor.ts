// Types for the Comprehensive Page Editor

export interface DragItem {
  type: 'section' | 'container' | 'row' | 'column' | 'component' | 'template';
  id: string;
  data: any;
  sourceContext?: {
    sectionId?: string;
    containerId?: string;
    rowId?: string;
    columnId?: string;
  };
}

export interface DropZone {
  type: 'section' | 'container' | 'row' | 'column';
  id: string;
  accepts: string[]; // What types can be dropped here
  index: number;
}

export interface Component {
  id: string;
  type: string;
  label: string;
  props?: Record<string, any>;
}

export interface LayoutComponent extends Component {
  id: string;
  width?: number;
  height?: number;
}

export interface Column {
  id: string;
  width?: number;
  components: LayoutComponent[];
}

export interface Row {
  id: string;
  columns: Column[];
}

export interface Container {
  id: string;
  rows: Row[];
}

export interface Section {
  id: string;
  name: string;
  type: 'hero' | 'content' | 'footer' | 'custom';
  content?: string;
  container: Container;
  settings?: {
    background?: string;
    padding?: string;
    margin?: string;
    customCSS?: string;
  };
  version?: number;
  lastModified?: Date;
}

export interface PageLayout {
  id: string;
  name: string;
  sections: Section[];
  settings?: {
    title?: string;
    description?: string;
    customCSS?: string;
  };
}

export interface Page {
  id: string;        // UUID
  name: string;      // page title
  sections: Section[]; // array of sections
  active: boolean;   // visibility in dropdown
  disabled: boolean; // whether the page is disabled
}

export interface ComponentDefinition {
  id: string;
  name: string;
  type: string;
  category: 'content' | 'media' | 'interactive' | 'layout' | 'advanced';
  icon: string;
  description: string;
  defaultProps: Record<string, any>;
  schema: {
    properties: {
      [key: string]: {
        type: 'text' | 'textarea' | 'richtext' | 'image' | 'color' | 'number' | 'select' | 'toggle' | 'list' | 'image-array' | 'slide-array' | 'card-array';
        label: string;
        default: any;
        options?: any[];
        validation?: any;
        min?: number;
        max?: number;
        step?: number;
      };
    };
  };
  render: (props: any) => JSX.Element;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  filePath: string;
  fileType: 'image' | 'video' | 'document';
  mimeType: string;
  fileSize: number;
  dimensions?: string; // e.g., "1920x1080"
  altText?: string;
  tags?: string[];
  uploadedBy: string;
  createdAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  category: string;
  structure: Section | PageLayout;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface Version {
  id: string;
  entityId: string; // section or page id
  entityType: 'section' | 'page';
  version: number;
  content: any;
  settings?: any;
  createdAt: Date;
  createdBy: string;
  notes?: string;
}

export interface PageEditorProps {
  initialLayout?: PageLayout;
  onSave?: (layout: PageLayout) => void;
  onCancel?: () => void;
  isModal?: boolean;
  showSaveButton?: boolean;
  pageId?: string;
}

export interface EditorState {
  layout: PageLayout;
  selectedSectionId?: string;
  selectedComponent?: {
    sectionId: string;
    containerId: string;
    rowId: string;
    colId: string;
    compId: string;
    component: LayoutComponent;
  };
  isPreviewMode: boolean;
  currentDevice: 'desktop' | 'tablet' | 'mobile';
  zoom: number;
}
