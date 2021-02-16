const Yr = 0.2126;
const Yg = 0.7152;
const Yb = 0.0722;

var satR = 1;
var satG = 1;
var satB = 1;

var enhR = 1;
var enhG = 1;
var enhB = 1;

/* matrix multiplication */
var matmul33 = function(a, b) {
    var d = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    d[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
    d[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
    d[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];
    d[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
    d[4] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
    d[5] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];
    d[6] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
    d[7] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
    d[8] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];

    return d;
};

var matmul31 = function(m, v) {
    var d = [0, 0, 0];

    d[0] = m[0] * v[0] + m[1] * v[1] + m[2] * v[2];
    d[1] = m[3] * v[0] + m[4] * v[1] + m[5] * v[2];
    d[2] = m[6] * v[0] + m[7] * v[1] + m[8] * v[2];

    return d;
};

var inv33 = function(m) {
    // TBD
};

/* saturation and vividness */
var updateAttributes = function() {
    satR = Number($("#satR").val());
    satG = Number($("#satG").val());
    satB = Number($("#satB").val());

    enhR = Number($("#enhR").val());
    enhG = Number($("#enhG").val());
    enhB = Number($("#enhB").val());
};

var getSaturationMatrix = function() {
    var m = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    m[0] = Yr + satG * Yg + satB * Yb;
    m[1] = (1 - satG) * Yg;
    m[2] = (1 - satB) * Yb;
    m[3] = (1 - satR) * Yr;
    m[4] = satR * Yr + Yg + satB * Yb;
    m[5] = (1 - satB) * Yb;
    m[6] = (1 - satR) * Yr;
    m[7] = (1 - satG) * Yg;
    m[8] = satR * Yr + satG * Yg + Yb;

    return m;
};

var getEnhancementMatrix = function() {
    var m = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    m[0] = Yr + enhR * (1 - Yr);
    m[1] = (1 - enhR) * Yg;
    m[2] = (1 - enhR) * Yb;
    m[3] = (1 - enhG) * Yr;
    m[4] = Yg + enhG * (1 - Yg);
    m[5] = (1 - enhG) * Yb;
    m[6] = (1 - enhB) * Yr;
    m[7] = (1 - enhB) * Yg;
    m[8] = Yb + enhB * (1 - Yb);

    return m;
};

var getCCM = function() {
    var sat = getSaturationMatrix();
    var enh = getEnhancementMatrix();

    return matmul33(enh, sat);
};