/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "pannellum-react" {
  import * as React from "react";

  export interface PannellumProps {
    id?: string;
    width?: string;
    height?: string;
    image?: string;
    sceneId?: string;
    config?: any;
    className?: string;
    style?: React.CSSProperties;
    pitch?: number;
    yaw?: number;
    hfov?: number;
    autoLoad?: boolean;
    autoRotate?: boolean;
    compass?: boolean;
    showZoomCtrl?: boolean;
    showFullscreenCtrl?: boolean;
    mouseZoom?: boolean;
    hotSpotDebug?: boolean;
    onLoad?: () => void;
    onError?: (err: any) => void;
    onRender?: () => void;
    children?: React.ReactNode;
  }

  export class Pannellum extends React.Component<PannellumProps> {}
}
