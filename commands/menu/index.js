import style1 from "./style1.js";
import style2 from "./style2.js";
import style3 from "./style3.js";
import style4 from "./style4.js";
import style5 from "./style5.js";
import style6 from "./style6.js";
import style7 from "./style7.js";
import style8 from "./style8.js";
import style9 from "./style9.js";
import style10 from "./style10.js";
import style11 from "./style11.js";
import style12 from "./style12.js";
import style13 from "./style13.js";
import style14 from "./style14.js";
import style15 from "./style15.js";
import style16 from "./style16.js";

const styles = {
    1: style1,
    2: style2,
    3: style3,
    4: style4,
    5: style5,
    6: style6,
    7: style7,
    8: style8,
    9: style9,
    10: style10,
    11: style11,
    12: style12,
    13: style13,
    14: style14,
    15: style15,
    16: style16
};

export default function getMenuStyle(style = 10, data) {

    const selected = styles[style] || styles[10];

    return selected(data);

}
