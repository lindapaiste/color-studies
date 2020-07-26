//decided that I just want the serif for headings, not for everything
import {createMuiTheme} from "@material-ui/core";

const fontFamily = '"Palatino Linotype", "Book Antiqua", Palatino, serif';
export const theme = createMuiTheme({
    typography: {
        h1: {
            fontFamily,
            fontSize: '3rem', //default is 6rem => 96px
        },
        h2: {
            fontFamily,
            fontSize: '2.5rem', //default is 3.75rem => 60px
        },
        h3: {
            fontFamily,
            fontSize: '2.125rem' //default is 3rem => 48px
        },
        h4: {
            fontFamily,
            fontSize: '1.75rem' //default is 2.125rem => 34px
        },
        h5: {
            fontFamily,
        },
        h6: {
            fontFamily,
        }
        //h5 is 1.5rem
        //h6 is 1.25rem
    }
});
