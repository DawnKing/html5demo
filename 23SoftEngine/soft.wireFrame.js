var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };

var SoftEngine;
(function (SoftEngine) {
  var WireFrame = (function (_super) {
      __extends(WireFrame, _super);
      function WireFrame(canvas) {
          _super.call(this, canvas);
      }
    return WireFrame;
  })(SoftEngine.Device);
  SoftEngine.WireFrame = WireFrame;
})(SoftEngine || (SoftEngine = {}));
