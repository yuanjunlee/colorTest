var setInputColor = function(rgb) {
    $("#inputR").val(rgb[0]);
    $("#inputG").val(rgb[1]);
    $("#inputB").val(rgb[2]);
    $("#inputColorBlock").css("background-color", toRGBString(rgb));
};

var setInputHSV = function(hsv) {
    $("#inputH").val(hsv[0]);
    $("#inputS").val(hsv[1]);
    $("#inputV").val(hsv[2]);
};

var setOutputColor = function(rgb) {
    $("#outputR").val(rgb[0]);
    $("#outputG").val(rgb[1]);
    $("#outputB").val(rgb[2]);
    $("#outputColorBlock").css("background-color", toRGBString(rgb));
};

var setOutputHSV = function(hsv) {
    $("#outputH").val(hsv[0]);
    $("#outputS").val(hsv[1]);
    $("#outputV").val(hsv[2]);
};

var getInputRGB = function() {
    var r = $("#inputR").val();
    var g = $("#inputG").val();
    var b = $("#inputB").val();

    if (r == "") {
        r = 0;
    }
    r = clamp(r, 0, 255);
    if (g == "") {
        g = 0;
    }
    g = clamp(g, 0, 255);
    if (b == "") {
        b = 0;
    }
    b = clamp(b, 0, 255);

    var rgb = [r, g, b];
    setInputColor(rgb);

    var hsv = rgb2hsv(rgb);
    setInputHSV(hsv);

    var rgb_out = calcOutputColor(rgb);
    setOutputColor(rgb_out);

    var hsv_out = rgb2hsv(rgb_out);
    setOutputHSV(hsv_out);
};

var getInputHSV = function() {
    var h = $("#inputH").val();
    var s = $("#inputS").val();
    var v = $("#inputV").val();

    if (h == "") {
        h = 0;
    } else if (h < 0) {
        h += 360;
    } else if (h >= 360) {
        h -= 360;
    }
    h = clamp(h, 0, 360);
    if (s == "") {
        s = 0;
    }
    s = clamp(s, 0, 100);
    if (v == "") {
        v = 0;
    }
    v = clamp(v, 0, 100);

    var hsv = [h, s, v];
    setInputHSV(hsv);

    var rgb = hsv2rgb(hsv);
    setInputColor(rgb);
    
    var rgb_out = calcOutputColor(rgb);
    setOutputColor(rgb_out);
    
    var hsv_out = rgb2hsv(rgb_out);
    setOutputHSV(hsv_out);
};

var main = function() {
    $(".inputRGB").change(getInputRGB);
    $(".inputHSV").change(getInputHSV);

    $(".ccmAttr").change(updateAttributes);
    $("#gammaSelect").change(updateGamma);
    $(".ccmControl").change(getInputRGB);
};

$(document).ready(function() {
    main();
});