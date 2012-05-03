﻿/// <reference path="ContentControl.js"/>
/// CODE
/// <reference path="Primitives/IScrollInfo.js"/>
/// <reference path="ScrollContentPresenter.js"/>
/// <reference path="Primitives/ScrollEventArgs.js"/>
/// <reference path="Primitives/Enums.js"/>

//#region ScrollViewer
var ScrollViewer = Nullstone.Create("ScrollViewer", ContentControl);

ScrollViewer.Instance.Init = function () {
    this.Init$ContentControl();
    this.RequestBringIntoView.Subscribe(this._OnRequestBringIntoView, this);
    this.$ScrollChangedCallback = null;
};

//#region Dependency Properties

ScrollViewer.OnScrollBarVisibilityPropertyChanged = function (d, args) {
    if (d == null)
        return;
    var scrollInfo = d.GetScrollInfo();
    if (scrollInfo == null)
        return;
    scrollInfo.SetCanHorizontallyScroll(d.GetHorizontalScrollBarVisibility() !== ScrollBarVisibility.Disabled);
    scrollInfo.SetCanVerticallyScroll(d.GetVerticalScrollBarVisibility() !== ScrollBarVisibility.Disabled);
    d._InvalidateMeasure();
};

ScrollViewer.HorizontalScrollBarVisibilityProperty = DependencyProperty.RegisterAttachedCore("HorizontalScrollBarVisibility", function () { return new Enum(ScrollBarVisibility); }, ScrollViewer, ScrollBarVisibility.Disabled, ScrollViewer.OnScrollBarVisibilityPropertyChanged);
ScrollViewer.Instance.GetHorizontalScrollBarVisibility = function () {
    ///<returns type="ScrollBarVisibility"></returns>
    return this.$GetValue(ScrollViewer.HorizontalScrollBarVisibilityProperty);
};
ScrollViewer.Instance.SetHorizontalScrollBarVisibility = function (value) {
    ///<param name="value" type="ScrollBarVisibility"></param>
    this.$SetValue(ScrollViewer.HorizontalScrollBarVisibilityProperty, value);
};

ScrollViewer.VerticalScrollBarVisibilityProperty = DependencyProperty.RegisterAttachedCore("VerticalScrollBarVisibility", function () { return new Enum(ScrollBarVisibility); }, ScrollViewer, ScrollBarVisibility.Disabled, ScrollViewer.OnScrollBarVisibilityPropertyChanged);
ScrollViewer.Instance.GetVerticalScrollBarVisibility = function () {
    ///<returns type="ScrollBarVisibility"></returns>
    return this.$GetValue(ScrollViewer.VerticalScrollBarVisibilityProperty);
};
ScrollViewer.Instance.SetVerticalScrollBarVisibility = function (value) {
    ///<param name="value" type="ScrollBarVisibility"></param>
    this.$SetValue(ScrollViewer.VerticalScrollBarVisibilityProperty, value);
};


ScrollViewer.ComputedHorizontalScrollBarVisibilityProperty = DependencyProperty.RegisterReadOnlyCore("ComputedHorizontalScrollBarVisibility", function () { return new Enum(Visibility); }, ScrollViewer);
ScrollViewer.Instance.GetComputedHorizontalScrollBarVisibility = function () {
    ///<returns type="Visibility"></returns>
    return this.$GetValue(ScrollViewer.ComputedHorizontalScrollBarVisibilityProperty);
};

ScrollViewer.ComputedVerticalScrollBarVisibilityProperty = DependencyProperty.RegisterReadOnlyCore("ComputedVerticalScrollBarVisibility", function () { return new Enum(Visibility); }, ScrollViewer);
ScrollViewer.Instance.GetComputedVerticalScrollBarVisibility = function () {
    ///<returns type="Visibility"></returns>
    return this.$GetValue(ScrollViewer.ComputedVerticalScrollBarVisibilityProperty);
};

ScrollViewer.HorizontalOffsetProperty = DependencyProperty.RegisterReadOnlyCore("HorizontalOffset", function () { return Number; }, ScrollViewer);
ScrollViewer.Instance.GetHorizontalOffset = function () {
    ///<returns type="Number"></returns>
    return this.$xOffset;
};
ScrollViewer.Instance._SetHorizontalOffset = function (value) {
    /// <param name="value" type="Number"></param>
    this.$xOffset = value;
    this._SetValueInternal(ScrollViewer.HorizontalOffsetProperty, value);
};

ScrollViewer.VerticalOffsetProperty = DependencyProperty.RegisterReadOnlyCore("VerticalOffset", function () { return Number; }, ScrollViewer);
ScrollViewer.Instance.GetVerticalOffset = function () {
    ///<returns type="Number"></returns>
    return this.$yOffset;
};
ScrollViewer.Instance._SetVerticalOffset = function (value) {
    /// <param name="value" type="Number"></param>
    this.$yOffset = value;
    this._SetValueInternal(ScrollViewer.VerticalOffsetProperty, value);
};

ScrollViewer.ScrollableWidthProperty = DependencyProperty.RegisterReadOnlyCore("ScrollableWidth", function () { return Number; }, ScrollViewer);
ScrollViewer.Instance.GetScrollableWidth = function () {
    ///<returns type="Number"></returns>
    return this.$GetValue(ScrollViewer.ScrollableWidthProperty);
};

ScrollViewer.ScrollableHeightProperty = DependencyProperty.RegisterReadOnlyCore("ScrollableHeight", function () { return Number; }, ScrollViewer);
ScrollViewer.Instance.GetScrollableHeight = function () {
    ///<returns type="Number"></returns>
    return this.$GetValue(ScrollViewer.ScrollableHeightProperty);
};

ScrollViewer.ViewportWidthProperty = DependencyProperty.RegisterReadOnlyCore("ViewportWidth", function () { return Number; }, ScrollViewer);
ScrollViewer.Instance.GetViewportWidth = function () {
    ///<returns type="Number"></returns>
    return this.$xViewport;
};
ScrollViewer.Instance._SetViewportWidth = function (value) {
    /// <param name="value" type="Number"></param>
    this.$xViewport = value;
    this._SetValueInternal(ScrollViewer.ViewportWidthProperty, value);
};

ScrollViewer.ViewportHeightProperty = DependencyProperty.RegisterReadOnlyCore("ViewportHeight", function () { return Number; }, ScrollViewer);
ScrollViewer.Instance.GetViewportHeight = function () {
    ///<returns type="Number"></returns>
    return this.$yViewport;
};
ScrollViewer.Instance._SetViewportHeight = function (value) {
    /// <param name="value" type="Number"></param>
    this.$yViewport = value;
    this._SetValueInternal(ScrollViewer.ViewportHeightProperty, value);
};

ScrollViewer.ExtentWidthProperty = DependencyProperty.RegisterReadOnlyCore("ExtentWidth", function () { return Number; }, ScrollViewer);
ScrollViewer.Instance.GetExtentWidth = function () {
    ///<returns type="Number"></returns>
    return this.$xExtent;
};
ScrollViewer.Instance._SetExtentWidth = function (value) {
    /// <param name="value" type="Number"></param>
    this.$xExtent = value;
    this._SetValueInternal(ScrollViewer.ExtentWidthProperty, value);
};

ScrollViewer.ExtentHeightProperty = DependencyProperty.RegisterReadOnlyCore("ExtentHeight", function () { return Number; }, ScrollViewer);
ScrollViewer.Instance.GetExtentHeight = function () {
    ///<returns type="Number"></returns>
    return this.$yExtent;
};
ScrollViewer.Instance._SetExtentHeight = function (value) {
    /// <param name="value" type="Number"></param>
    this.$yExtent = value;
    this._SetValueInternal(ScrollViewer.ExtentHeightProperty, value);
};

//#endregion

//#region Properties

ScrollViewer.Instance.GetScrollInfo = function () {
    ///<returns type="IScrollInfo"></returns>
    return this.$ScrollInfo;
};
ScrollViewer.Instance.SetScrollInfo = function (value) {
    ///<param name="value" type="IScrollInfo"></param>
    this.$ScrollInfo = value;
    if (value != null) {
        value.SetCanHorizontallyScroll(this.GetHorizontalScrollBarVisibility() !== ScrollBarVisibility.Disabled);
        value.SetCanVerticallyScroll(this.GetVerticalScrollBarVisibility() !== ScrollBarVisibility.Disabled);
    }
};

//#endregion

//#region Line

ScrollViewer.Instance.LineUp = function () {
    this._HandleVerticalScroll(new ScrollEventArgs(ScrollEventType.SmallDecrement, 0));
};
ScrollViewer.Instance.LineDown = function () {
    this._HandleVerticalScroll(new ScrollEventArgs(ScrollEventType.SmallIncrement, 0));
};
ScrollViewer.Instance.LineLeft = function () {
    this._HandleHorizontalScroll(new ScrollEventArgs(ScrollEventType.SmallDecrement, 0));
};
ScrollViewer.Instance.LineRight = function () {
    this._HandleHorizontalScroll(new ScrollEventArgs(ScrollEventType.SmallIncrement, 0));
};

//#endregion

//#region Page

ScrollViewer.Instance.PageHome = function () {
    this._HandleHorizontalScroll(new ScrollEventArgs(ScrollEventType.First, 0));
};
ScrollViewer.Instance.PageEnd = function () {
    this._HandleHorizontalScroll(new ScrollEventArgs(ScrollEventType.Last, 0));
};

ScrollViewer.Instance.PageUp = function () {
    this._HandleVerticalScroll(new ScrollEventArgs(ScrollEventType.LargeDecrement, 0));
};
ScrollViewer.Instance.PageDown = function () {
    this._HandleVerticalScroll(new ScrollEventArgs(ScrollEventType.LargeIncrement, 0));
};
ScrollViewer.Instance.PageLeft = function () {
    this._HandleHorizontalScroll(new ScrollEventArgs(ScrollEventType.LargeDecrement, 0));
};
ScrollViewer.Instance.PageRight = function () {
    this._HandleHorizontalScroll(new ScrollEventArgs(ScrollEventType.LargeIncrement, 0));
};

//#endregion

//#region Scroll

ScrollViewer.Instance.InvalidateScrollInfo = function () {
    var info = this.GetScrollInfo();
    if (info == null)
        return;

    var extentWidth = info.GetExtentWidth();
    var extentHeight = info.GetExtentHeight();
    var viewportWidth = info.GetViewportWidth();
    var viewportHeight = info.GetViewportHeight();
    var horizontalOffset = info.GetHorizontalOffset();
    var verticalOffset = info.GetVerticalOffset();
    if (!this.$InMeasure) {
        var viewportWidth = info.GetViewportWidth();
        if (this.GetHorizontalScrollBarVisibility() !== ScrollBarVisibility.Auto || (this.$ScrollVisibilityX !== Visibility.Collapsed || extentWidth <= viewportWidth) && (this.$ScrollVisibilityX !== Visibility.Visible || extentWidth >= viewportWidth)) {
            extentWidth = info.GetExtentHeight();
            viewportWidth = info.GetViewportHeight();
            if (this.GetVerticalScrollBarVisibility() === ScrollBarVisibility.Auto && (this.$ScrollVisibilityY === Visibility.Collapsed && extentWidth > viewportWidth || this.$ScrollVisibilityY === Visibility.Visible && extentWidth < viewportWidth))
                this._InvalidateMeasure();
        } else {
            this._InvalidateMeasure();
        }
    }
    if (!DoubleUtil.AreClose(this.$xOffset, horizontalOffset) || !DoubleUtil.AreClose(this.$yOffset, verticalOffset) || !DoubleUtil.AreClose(this.$xViewport, viewportWidth) || !DoubleUtil.AreClose(this.$yViewport, viewportHeight) || !DoubleUtil.AreClose(this.$xExtent, extentWidth) || !DoubleUtil.AreClose(this.$yExtent, extentHeight)) {
        var num1 = this.$xOffset;
        var num2 = this.$yOffset;
        var num3 = this.$xViewport;
        var num4 = this.$yViewport;
        var num5 = this.$xExtent;
        var num6 = this.$yExtent;
        var scrollableWidth = Math.max(0, this.GetExtentWidth() - this.GetViewportWidth());
        var scrollableHeight = Math.max(0, this.GetExtentHeight() - this.GetViewportHeight());
        var flag = false;
        try {
            if (!DoubleUtil.AreClose(num1, horizontalOffset)) {
                this._SetHorizontalOffset(horizontalOffset);
                flag = true;
            }
            if (!DoubleUtil.AreClose(num2, verticalOffset)) {
                this._SetVerticalOffset(verticalOffset);
                flag = true;
            }
            if (!DoubleUtil.AreClose(this.$xViewport, viewportWidth)) {
                this._SetViewportWidth(viewportWidth);
                flag = true;
            }
            if (!DoubleUtil.AreClose(this.$yViewport, viewportHeight)) {
                this._SetViewportHeight(viewportHeight);
                flag = true;
            }
            if (!DoubleUtil.AreClose(this.$xExtent, extentWidth)) {
                this._SetExtentWidth(extentWidth);
                flag = true;
            }
            if (!DoubleUtil.AreClose(this.$yExtent, extentHeight)) {
                this._SetExtentHeight(extentHeight);
                flag = true;
            }
            var scrollableWidth1 = Math.max(0, this.GetExtentWidth() - this.GetViewportWidth());
            if (!DoubleUtil.AreClose(scrollableWidth, scrollableWidth1)) {
                this._SetValueInternal(ScrollViewer.ScrollableWidthProperty, scrollableWidth1);
                flag = true;
            }
            var scrollableHeight1 = Math.max(0, this.GetExtentHeight() - this.GetViewportHeight());
            if (!DoubleUtil.AreClose(scrollableHeight, scrollableHeight1)) {
                this._SetValueInternal(ScrollViewer.ScrollableHeightProperty, scrollableHeight1);
                flag = true;
            }
        } finally {
            if (flag) {
                if (!DoubleUtil.AreClose(num1, this.$xOffset) && this.ElementHorizontalScrollBar != null && !this.$ElementHorizontalScrollBar.GetIsDragging()) {
                    this.$ElementHorizontalScrollBar.Value = this.$xOffset;
                }
                if (!DoubleUtil.AreClose(num2, this.$yOffset) && this.$ElementVerticalScrollBar != null && !this.$ElementVerticalScrollBar.GetIsDragging()) {
                    this.$ElementVerticalScrollBar.Value = this.$yOffset;
                }
                this._OnScrollChanged(this.GetHorizontalOffset(), this.GetVerticalOffset());
            }
        }
    }
};
ScrollViewer.Instance._ScrollInDirection = function (key) {
    //TODO: FlowDirection
    //var flowDirection = this.GetFlowDirection() === FlowDirection.RightToLeft;
    switch (key) {
        case Key.PageUp:
            this.PageUp();
            break;
        case Key.PageDown:
            this.PageDown();
            break;
        case Key.End:
            this.PageEnd();
            break;
        case Key.Home:
            this.PageHome();
            break;
        case Key.Left:
            this.LineLeft();
            break;
        case Key.Up:
            this.LineUp();
            break;
        case Key.Right:
            this.LineRight();
            break;
        case Key.Down:
            this.LineDown();
            break;            
    }
};
ScrollViewer.Instance.ScrollToHorizontalOffset = function (offset) {
    this._HandleHorizontalScroll(new ScrollEventArgs(ScrollEventType.ThumbPosition, offset));
};
ScrollViewer.Instance.ScrollToVerticalOffset = function (offset) {
    this._HandleVerticalScroll(new ScrollEventArgs(ScrollEventType.ThumbPosition, offset));
};
ScrollViewer.Instance._HandleScroll = function (orientation, e) {
    /// <param name="e" type="ScrollEventArgs"></param>
    if (orientation !== Orientation.Horizontal)
        this._HandleVerticalScroll(e);
    else
        this._HandleHorizontalScroll(e);
};
ScrollViewer.Instance._HandleHorizontalScroll = function (e) {
    /// <param name="e" type="ScrollEventArgs"></param>
    var scrollInfo = this.GetScrollInfo();
    if (scrollInfo == null)
        return;
    var offset = scrollInfo.GetHorizontalOffset();
    var newValue = offset;
    switch (e.ScrollEventType) {
        case ScrollEventType.SmallDecrement:
            scrollInfo.LineLeft();
            break;
        case ScrollEventType.SmallIncrement:
            scrollInfo.LineRight();
            break;
        case ScrollEventType.LargeDecrement:
            scrollInfo.PageLeft();
            break;
        case ScrollEventType.LargeIncrement:
            scrollInfo.PageRight();
            break;
        case ScrollEventType.ThumbPosition:
        case ScrollEventType.ThumbTrack:
            newValue = e.Value;
            break;
        case ScrollEventType.First:
            newValue = -1.79769313486232E+308;
            break;
        case ScrollEventType.Last:
            newValue = 1.79769313486232E+308;
            break;
    }
    newValue = Math.max(newValue, 0);
    newValue = Math.min(this.GetScrollableWidth(), newValue);
    if (!DoubleUtil.AreClose(offset, newValue))
        scrollInfo._SetValueInternal(ScrollViewer.HorizontalOffsetProperty, newValue);
};
ScrollViewer.Instance._HandleVerticalScroll = function (e) {
    /// <param name="e" type="ScrollEventArgs"></param>
    var scrollInfo = this.GetScrollInfo();
    if (scrollInfo == null)
        return;
    var offset = scrollInfo.GetVerticalOffset();
    var newValue = offset;
    switch (e.ScrollEventType) {
        case ScrollEventType.SmallDecrement:
            scrollInfo.LineUp();
            break;
        case ScrollEventType.SmallIncrement:
            scrollInfo.LineDown();
            break;
        case ScrollEventType.LargeDecrement:
            scrollInfo.PageUp();
            break;
        case ScrollEventType.LargeIncrement:
            scrollInfo.PageDown();
            break;
        case ScrollEventType.ThumbPosition:
        case ScrollEventType.ThumbTrack:
            newValue = e.Value;
            break;
        case ScrollEventType.First:
            newValue = -1.79769313486232E+308;
            break;
        case ScrollEventType.Last:
            newValue = 1.79769313486232E+308;
            break;
    }
    newValue = Math.max(newValue, 0);
    newValue = Math.min(this.GetScrollableHeight(), newValue);
    if (!DoubleUtil.AreClose(offset, newValue))
        scrollInfo.SetVerticalOffset(newValue);
};

ScrollViewer.Instance._OnScrollChanged = function (horizontal, vertical) {
    if (this.$ScrollChangedCallback != null)
        this.$ScrollChangedCallback(horizontal, vertical);
};

//#endregion

ScrollViewer.Instance.OnApplyTemplate = function () {
    this.OnApplyTemplate$ContentControl();
    this.$ElementScrollContentPresenter = Nullstone.As(this.GetTemplateChild("ScrollContentPresenter"), ScrollContentPresenter);
    this.$ElementHorizontalScrollBar = Nullstone.As(this.GetTemplateChild("HorizontalScrollBar"), ScrollBar);
    if (this.$ElementHorizontalScrollBar != null) {
        this.$ElementHorizontalScrollBar.Scroll.Subscribe(function (sender, e) { this._HandleScroll(Orientation.Horizontal, e); }, this);
    }
    this.$ElementVerticalScrollBar = Nullstone.As(this.GetTemplateChild("VerticalScrollBar"), ScrollBar);
    if (this.$ElementVerticalScrollBar != null) {
        this.$ElementVerticalScrollBar.Scroll.Subscribe(function (sender, e) { this._HandleScroll(Orientation.Vertical, e); }, this);
    }
};

ScrollViewer.Instance.MakeVisible = function (uie, targetRect) {
    /// <param name="uie" type="UIElement"></param>
    /// <param name="targetRect" type="Rect"></param>
    var escp = this.$ElementScrollContentPresenter;
    if (uie != null && escp != null && (Nullstone.RefEquals(escp, uie) || escp.IsAncestorOf(uie)) && this.IsAncestorOf(escp) && this._IsAttached) {
        if (targetRect.IsEmpty()) {
            targetRect = new Rect(0, 0, uie._RenderSize.Width, uie._RenderSize.Height);
        }
        var rect2 = escp.MakeVisible(uie, targetRect);
        if (!rect2.IsEmpty()) {
            var p = escp.TransformToVisual(this).Transform(new Point(rect2.X, rect2.Y));
            rect2.X = p.X;
            rect2.Y = p.Y;
        }
        this.BringIntoView(rect2);
    }
};

//#region Measure

ScrollViewer.Instance.MeasureOverride = function (constraint) {
    /// <param name="constraint" type="Size"></param>
    /// <returns type="Size" />

    this.$InChildInvalidateMeasure = false;

    var child = null;
    if (VisualTreeHelper.GetChildrenCount(this) > 0)
        child = Nullstone.As(VisualTreeHelper.GetChild(this, 0), UIElement);
    if (child == null)
        return new Size();

    var scrollInfo = this.GetScrollInfo();
    var verticalScrollBarVisibility = this.GetVerticalScrollBarVisibility();
    var horizontalScrollBarVisibility = this.GetHorizontalScrollBarVisibility();
    var flag2 = verticalScrollBarVisibility === ScrollBarVisibility.Auto;
    var flag3 = horizontalScrollBarVisibility === ScrollBarVisibility.Auto;
    var visibility = verticalScrollBarVisibility !== ScrollBarVisibility.Visible ? Visibility.Collapsed : Visibility.Visible;
    var visibility1 = horizontalScrollBarVisibility !== ScrollBarVisibility.Visible ? Visibility.Collapsed : Visibility.Visible;
    try {
        this.$InMeasure = true;
        if (this.$ScrollVisibilityY !== visibility) {
            this.$ScrollVisibilityY = visibility;
            this._SetValueInternal(ScrollViewer.ComputedVerticalScrollBarVisibilityProperty, this.$ScrollVisibilityY);
        }
        if (this.$ScrollVisibilityX !== visibility1) {
            this.$ScrollVisibilityX = visibility1;
            this._SetValueInternal(ScrollViewer.ComputedHorizontalScrollBarVisibilityProperty, this.$ScrollVisibilityX);
        }
        if (scrollInfo != null) {
            scrollInfo.SetCanHorizontallyScroll(horizontalScrollBarVisibility !== ScrollBarVisibility.Disabled);
            scrollInfo.SetCanVerticallyScroll(verticalScrollBarVisibility !== ScrollBarVisibility.Disabled);
        }
        child.Measure(constraint);
        if (scrollInfo != null && (flag2 || flag3)) {
            var flag4 = flag3 && scrollInfo.GetExtentWidth() > scrollInfo.GetViewportWidth();
            var flag5 = flag2 && scrollInfo.GetExtentHeight() > scrollInfo.GetViewportHeight();

            if (flag4 && this.$ScrollVisibilityX !== Visibility.Visible) {
                this.$ScrollVisibilityX = Visibility.Visible;
                this._SetValueInternal(ScrollViewer.ComputedHorizontalScrollBarVisibilityProperty, this.$ScrollVisibilityX);
            }
            if (flag5 && this.$ScrollVisibilityY !== Visibility.Visible) {
                this.$ScrollVisibilityY = Visibility.Visible;
                this._SetValueInternal(ScrollViewer.ComputedVerticalScrollBarVisibilityProperty, this.$ScrollVisibilityY);
            }
            if (flag4 || flag5) {
                this.$InChildInvalidateMeasure = true;
                child._InvalidateMeasure();
                child.Measure(constraint);
            }
            if (flag3 && flag2 && flag4 !== flag5) {
                var flag6 = !flag4 && scrollInfo.GetExtentWidth() > scrollInfo.GetViewportWidth();
                var flag7 = !flag5 && scrollInfo.GetExtentHeight() > scrollInfo.GetViewportHeight();
                if (!flag6) {
                    if (flag7 && this.$ScrollVisibilityY !== Visibility.Visible) {
                        this.$ScrollVisibilityY = Visibility.Visible;
                        this._SetValueInternal(ScrollViewer.ComputedVerticalScrollBarVisibilityProperty, this.$ScrollVisibilityY);
                    }
                } else {
                    if (this.$ScrollVisibilityX !== Visibility.Visible) {
                        this.$ScrollVisibilityX = Visibility.Visible;
                        this._SetValueInternal(ScrollViewer.ComputedHorizontalScrollBarVisibilityProperty, this.$ScrollVisibilityX);
                    }
                }
                if (flag6 || flag7) {
                    this.$InChildInvalidateMeasure = true;
                    child._InvalidateMeasure();
                    child.Measure(constraint);
                }
            }
        }
    } finally {
        this.$InMeasure = false;
    }
    return child._DesiredSize;
};

//#endregion

//#region Mouse

ScrollViewer.Instance.OnMouseLeftButtonDown = function (sender, args) {
    this.OnMouseLeftButtonDown$ContentControl(sender, args);
    if (args.Handled)
        return;
    if (this.$TemplatedParentHandlesMouseButton)
        return;
    args.Handled = this.Focus();
};
ScrollViewer.Instance.OnMouseWheel = function (sender, args) {
    this.OnMouseWheel$ContentControl(sender, args);
    if (args.Handled)
        return;
    var scrollInfo = this.GetScrollInfo();
    if (scrollInfo == null)
        return;
    if ((args.Delta > 0 && scrollInfo.GetVerticalOffset() !== 0) || (args.Delta < 0 && scrollInfo.GetVerticalOffset() < this.GetScrollableHeight())) {
        if (args.Delta >= 0)
            scrollInfo.MouseWheelUp();
        else
            scrollInfo.MouseWheelDown();
        args.Handled = true;
    }
};

//#endregion

//#region Keyboard

ScrollViewer.Instance.OnKeyDown = function (sender, args) {
    this.OnKeyDown$ContentControl(sender, args);
    this._HandleKeyDown(args);
};
ScrollViewer.Instance._HandleKeyDown = function (args) {
    if (args.Handled)
        return;
    if (!this.$TemplatedParentHandlesScrolling)
        return;

    var orientation = Orientation.Vertical;
    var scrollEventType = ScrollEventType.ThumbTrack;
    //TODO: FlowDirection
    //var flowDirection = base.FlowDirection === FlowDirection.RightToLeft;
    switch (args.KeyCode) {
        case Keys.PageUp:
            scrollEventType = ScrollEventType.LargeDecrement;
            break;
        case Keys.PageDown:
            scrollEventType = ScrollEventType.LargeIncrement;
            break;
        case Keys.End:
            if (!args.Modifiers.Ctrl)
                orientation = Orientation.Horizontal;
            scrollEventType = ScrollEventType.Last;
            break;
        case Keys.Home:
            if (!args.Modifiers.Ctrl)
                orientation = Orientation.Horizontal;
            scrollEventType = ScrollEventType.First;
            break;
        case Keys.Left:
            orientation = Orientation.Horizontal;
            scrollEventType = ScrollEventType.SmallDecrement;
        case Keys.Up:
            scrollEventType = ScrollEventType.SmallDecrement;
            break;
        case Keys.Right:
            orientation = Orientation.Horizontal;
            scrollEventType = ScrollEventType.SmallIncrement;
        case Keys.Down:
            scrollEventType = ScrollEventType.SmallIncrement;
            break;
    }
    if (scrollEventType !== ScrollEventType.ThumbTrack) {
        this._HandleScroll(orientation, new ScrollEventArgs(scrollEventType, 0));
        args.Handled = true;
    }
};

//#endregion

ScrollViewer.Instance._OnRequestBringIntoView = function (sender, args) {
    /// <param name="args" type="RequestBringIntoViewEventArgs"></param>
    var sv = Nullstone.As(sender, ScrollViewer);
    var targetObj = args.TargetObject;
    if (targetObj != null && sv != null && !Nullstone.RefEquals(sv, targetObj) && sv.IsAncestorOf(targetObj)) {
        sv.MakeVisible(targetObj, args.TargetRect);
        args.Handled = true;
    }
};

ScrollViewer.Instance.GetDefaultStyle = function () {
    var styleJson = {
        Type: Style,
        Props: {
            TargetType: ScrollViewer
        },
        Children: [
{
    Type: Setter,
    Props: {
        Property: DependencyProperty.GetDependencyProperty(ScrollViewer, "HorizontalContentAlignment"),
        Value: "Left"
    }
},
{
    Type: Setter,
    Props: {
        Property: DependencyProperty.GetDependencyProperty(ScrollViewer, "VerticalContentAlignment"),
        Value: "Top"
    }
},
{
    Type: Setter,
    Props: {
        Property: DependencyProperty.GetDependencyProperty(ScrollViewer, "VerticalScrollBarVisibility"),
        Value: "Visible"
    }
},
{
    Type: Setter,
    Props: {
        Property: DependencyProperty.GetDependencyProperty(ScrollViewer, "Padding"),
        Value: "4"
    }
},
{
    Type: Setter,
    Props: {
        Property: DependencyProperty.GetDependencyProperty(ScrollViewer, "BorderThickness"),
        Value: "1"
    }
},
{
    Type: Setter,
    Props: {
        Property: DependencyProperty.GetDependencyProperty(ScrollViewer, "BorderBrush"),
        Value: {
            Type: LinearGradientBrush,
            Props: {
                EndPoint: new Point(0.5, 1),
                StartPoint: new Point(0.5, 0)
            },
            Children: [
{
    Type: GradientStop,
    Props: {
        Color: Color.FromHex("#FFA3AEB9"),
        Offset: 0
    }
},
{
    Type: GradientStop,
    Props: {
        Color: Color.FromHex("#FF8399A9"),
        Offset: 0.375
    }
},
{
    Type: GradientStop,
    Props: {
        Color: Color.FromHex("#FF718597"),
        Offset: 0.375
    }
},
{
    Type: GradientStop,
    Props: {
        Color: Color.FromHex("#FF617584"),
        Offset: 1
    }
}]

        }
    }
},
{
    Type: Setter,
    Props: {
        Property: DependencyProperty.GetDependencyProperty(ScrollViewer, "Template"),
        Value: {
            Type: ControlTemplate,
            Props: {
                TargetType: ScrollViewer
            },
            Content: {
                Type: Border,
                Props: {
                    CornerRadius: new CornerRadius(2, 2, 2, 2),
                    BorderBrush: new TemplateBindingMarkup("BorderBrush"),
                    BorderThickness: new TemplateBindingMarkup("BorderThickness")
                },
                Content: {
                    Type: Grid,
                    Props: {
                        Background: new TemplateBindingMarkup("Background"),
                        RowDefinitions: [
{
    Type: RowDefinition,
    Props: {
        Height: new GridLength(1, GridUnitType.Star)
    }
},
{
    Type: RowDefinition,
    Props: {
        Height: new GridLength(1, GridUnitType.Auto)
    }
}]
,
                        ColumnDefinitions: [
{
    Type: ColumnDefinition,
    Props: {
        Width: new GridLength(1, GridUnitType.Star)
    }
},
{
    Type: ColumnDefinition,
    Props: {
        Width: new GridLength(1, GridUnitType.Auto)
    }
}]

                    },
                    Children: [
{
    Type: ScrollContentPresenter,
    Name: "ScrollContentPresenter",
    Props: {
        Cursor: new TemplateBindingMarkup("Cursor"),
        Margin: new TemplateBindingMarkup("Padding"),
        ContentTemplate: new TemplateBindingMarkup("ContentTemplate")
    }
},
{
    Type: Rectangle,
    Props: {
        Fill: {
            Type: SolidColorBrush,
            Props: {
                Color: Color.FromHex("#FFE9EEF4")
            }
        }
    },
    AttachedProps: [{
        Owner: Grid,
        Prop: "Column",
        Value: 1
    },
{
    Owner: Grid,
    Prop: "Row",
    Value: 1
}
]
},
{
    Type: ScrollBar,
    Name: "VerticalScrollBar",
    Props: {
        Width: 18,
        IsTabStop: false,
        Visibility: new TemplateBindingMarkup("ComputedVerticalScrollBarVisibility"),
        Orientation: Orientation.Vertical,
        ViewportSize: new TemplateBindingMarkup("ViewportHeight"),
        Maximum: new TemplateBindingMarkup("ScrollableHeight"),
        Minimum: 0,
        Value: new TemplateBindingMarkup("VerticalOffset"),
        Margin: new Thickness(0, -1, -1, -1)
    },
    AttachedProps: [{
        Owner: Grid,
        Prop: "Column",
        Value: 1
    },
{
    Owner: Grid,
    Prop: "Row",
    Value: 0
}
]
},
{
    Type: ScrollBar,
    Name: "HorizontalScrollBar",
    Props: {
        Height: 18,
        IsTabStop: false,
        Visibility: new TemplateBindingMarkup("ComputedHorizontalScrollBarVisibility"),
        Orientation: Orientation.Horizontal,
        ViewportSize: new TemplateBindingMarkup("ViewportWidth"),
        Maximum: new TemplateBindingMarkup("ScrollableWidth"),
        Minimum: 0,
        Value: new TemplateBindingMarkup("HorizontalOffset"),
        Margin: new Thickness(-1, 0, -1, -1)
    },
    AttachedProps: [{
        Owner: Grid,
        Prop: "Column",
        Value: 0
    },
{
    Owner: Grid,
    Prop: "Row",
    Value: 1
}
]
}]

                }
            }
        }
    }
}]

    };
    var parser = new JsonParser();
    return parser.CreateObject(styleJson, new NameScope());
};

Nullstone.FinishCreate(ScrollViewer);
//#endregion