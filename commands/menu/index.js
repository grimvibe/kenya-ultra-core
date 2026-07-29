import style1 from "./menu/style1.js";
import style2 from "./menu/style2.js";
import style3 from "./menu/style3.js";
import style4 from "./menu/style4.js";
import style5 from "./menu/style5.js";
import style6 from "./menu/style6.js";
import style7 from "./menu/style7.js";
import style8 from "./menu/style8.js";

const styles = {
    1: style1,
    2: style2,
    3: style3,
    4: style4,
    5: style5,
    6: style6,
    7: style7,
    8: style8
};

export default function getMenuStyle(style = 1, data) {

    const selected = styles[style] || styles[1];

    return selected(data);

}
