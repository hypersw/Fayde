﻿/// <reference path="Shape.js"/>
/// CODE
/// <reference path="../Engine/RenderContext.js"/>

//#region Rectangle
var Rectangle = Nullstone.Create("Rectangle", Shape);

Rectangle.Instance.Init = function () {
    this.Init$Shape();
    this.SetStretch(Stretch.Fill);
};

//#region Dependency Properties

Rectangle.RadiusXProperty = DependencyProperty.Register("RadiusX", function () { return Number; }, Rectangle, 0.0);
Rectangle.Instance.GetRadiusX = function () {
    ///<returns type="Number"></returns>
    return this.GetValue(Rectangle.RadiusXProperty);
};
Rectangle.Instance.SetRadiusX = function (value) {
    ///<param name="value" type="Number"></param>
    this.SetValue(Rectangle.RadiusXProperty, value);
};

Rectangle.RadiusYProperty = DependencyProperty.Register("RadiusY", function () { return Number; }, Rectangle, 0.0);
Rectangle.Instance.GetRadiusY = function () {
    ///<returns type="Number"></returns>
    return this.GetValue(Rectangle.RadiusYProperty);
};
Rectangle.Instance.SetRadiusY = function (value) {
    ///<param name="value" type="Number"></param>
    this.SetValue(Rectangle.RadiusYProperty, value);
};

//#endregion

Rectangle.Instance._DrawPath = function (ctx) {
    if (this._Path == null)
        this._BuildPath();
    this._DrawPath$Shape(ctx);
};
Rectangle.Instance._BuildPath = function () {
    var stretch = this.GetStretch();
    var t = this._IsStroked() ? this.GetStrokeThickness() : 0.0;
    var rect = new Rect(0, 0, this.GetActualWidth(), this.GetActualHeight());
    var radiusX = this.GetRadiusX();
    var radiusY = this.GetRadiusY();

    switch (stretch) {
        case Stretch.None:
            rect.Width = rect.Height = 0;
            break;
        case Stretch.Uniform:
            rect.Width = rect.Height = Math.min(rect.Width, rect.Height);
            break;
        case Stretch.UniformToFill:
            rect.Width = rect.Height = Math.max(rect.Width, rect.Height);
            break;
        case Stretch.Fill:
            break;
    }

    if (rect.Width === 0)
        rect.X = t * 0.5;
    if (rect.Height === 0)
        rect.Y = t * 0.5;

    var ta;
    if (t >= rect.Width || t >= rect.Height) {
        ta = t * 0.001;
        rect = rect.GrowBy(ta, ta, ta, ta);
        this._SetShapeFlags(ShapeFlags.Degenerate);
    } else {
        ta = -t * 0.5;
        rect = rect.GrowBy(ta, ta, ta, ta);
        this._SetShapeFlags(ShapeFlags.Normal);
    }

    this._Path = [];
    if (radiusX === 0.0 && radiusY === 0.0) {
        this._Path.push({ type: PathEntryType.Rect, x: rect.X, y: rect.Y, width: rect.Width, height: rect.Height });
        return;
    }
    if (radiusX === radiusY) {
        var left = rect.X;
        var top = rect.Y;
        var right = rect.X + rect.Width;
        var bottom = rect.Y + rect.Height;

        this._Path.push({ type: PathEntryType.Move, x: left + radiusX, y: top });
        //top edge
        this._Path.push({ type: PathEntryType.Line, x: right - radiusX, y: top });
        //top right arc
        this._Path.push({ type: PathEntryType.Quadratic, cpx: right, cpy: top, x: right, y: top + radiusY });
        //right edge
        this._Path.push({ type: PathEntryType.Line, x: right, y: bottom - radiusY });
        //bottom right arc
        this._Path.push({ type: PathEntryType.Quadratic, cpx: right, cpy: bottom, x: right - radiusX, y: bottom });
        //bottom edge
        this._Path.push({ type: PathEntryType.Line, x: left + radiusX, y: bottom });
        //bottom left arc
        this._Path.push({ type: PathEntryType.Quadratic, cpx: left, cpy: bottom, x: left, y: bottom - radiusY });
        //left edge
        this._Path.push({ type: PathEntryType.Line, x: left, y: top + radiusY });
        //top left arc
        this._Path.push({ type: PathEntryType.Quadratic, cpx: left, cpy: top, x: left + radiusX, y: top });
        return;
    }

    NotImplemented("Rectangle._BuildPath with RadiusX !== RadiusY");
    return;
};

Rectangle.Instance._ComputeStretchBounds = function () {
    /// <returns type="Rect" />
    return this._ComputeShapeBounds(false);
};
Rectangle.Instance._ComputeShapeBounds = function (logical) {
    /// <returns type="Rect" />
    var rect = new Rect(0, 0, this.GetActualWidth(), this.GetActualHeight());
    this._SetShapeFlags(ShapeFlags.Normal);

    var width = this.GetWidth();
    var height = this.GetHeight();
    if (rect.Width < 0.0 || rect.Height < 0.0 || width <= 0.0 || height <= 0.0) {
        this._SetShapeFlags(ShapeFlags.Empty);
        return new Rect();
    }

    var visualParent = this.GetVisualParent();
    if (visualParent != null && visualParent instanceof Canvas) {
        if (isNaN(width) !== isNaN(height)) {
            this._SetShapeFlags(ShapeFlags.Empty);
            return new Rect();
        }
    }

    var t = this._IsStroked() ? this.GetStrokeThickness() : 0.0;
    switch (this.GetStretch()) {
        case Stretch.None:
            rect.Width = rect.Height = 0.0;
            break;
        case Stretch.Uniform:
            rect.Width = rect.Height = Math.min(rect.Width, rect.Height);
            break;
        case Stretch.UniformToFill:
            rect.Width = rect.Height = Math.max(rect.Width, rect.Height);
            break;
        case Stretch.Fill:
            break;
    }

    if (rect.Width === 0)
        rect.X = t * 0.5;
    if (rect.Height === 0)
        rect.Y = t * 0.5;

    if (t >= rect.Width || t >= rect.Height) {
        var g = t * 0.5005;
        rect = rect.GrowBy(g, g, g, g);
        this._SetShapeFlags(ShapeFlags.Degenerate);
    } else {
        this._SetShapeFlags(ShapeFlags.Normal);
    }

    return rect;
};
Rectangle.Instance._ComputeShapeBoundsImpl = function (logical, matrix) {
    /// <returns type="Rect" />
    return logical ? new Rect(0, 0, 1.0, 1.0) : new Rect();
};
Rectangle.Instance._GetCoverageBounds = function () {
    var fill = this.GetFill();
    if (fill != null && fill.IsOpaque()) {
        var halfST = this.GetStrokeThickness / 2.0;
        var xr = this.GetRadiusX() + halfST;
        var yr = this.GetRadiusY() + halfST;
        return this._Bounds.GrowBy(-xr, -yr).RoundIn();
    }
    return new Rect();
}

Rectangle.Instance._OnPropertyChanged = function (args, error) {
    if (args.Property.OwnerType !== Rectangle) {
        this._OnPropertyChanged$Shape(args, error);
        return;
    }

    if (args.Property._ID === Rectangle.RadiusXProperty || args.Property._ID === Rectangle.RadiusYProperty) {
        this._InvalidateMeasure();
        this._InvalidatePathCache();
    }

    this._Invalidate();
    this.PropertyChanged.Raise(this, args);
};

Nullstone.FinishCreate(Rectangle);
//#endregion