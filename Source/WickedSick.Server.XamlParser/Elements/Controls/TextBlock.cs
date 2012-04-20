﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WickedSick.Server.XamlParser.TypeConverters;
using WickedSick.Server.XamlParser.Elements.Types;
using WickedSick.Server.XamlParser.Elements.Media;

namespace WickedSick.Server.XamlParser.Elements.Controls
{
    public class TextBlock : FrameworkElement
    {
        public static readonly PropertyDescription TextWrapping = PropertyDescription.Register("TextWrapping", typeof(TextWrapping), typeof(TextBlock));
        public static readonly PropertyDescription Foreground = PropertyDescription.Register("Foreground", typeof(Brush), typeof(TextBlock));
        public static readonly PropertyDescription FontSize = PropertyDescription.Register("FontSize", typeof(FontSize), typeof(TextBlock));
        public static readonly PropertyDescription Text = PropertyDescription.Register("Text", typeof(string), typeof(TextBlock), true);
        public static readonly PropertyDescription TextDecorations = PropertyDescription.Register("TextDecorations", typeof(DependencyObjectCollection<TextDecoration>), typeof(TextBlock));
    }
}