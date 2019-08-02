import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        primary: colors.teal.base, // #E53935
        secondary: colors.blueGrey.darken4, // #FFCDD2
        accent: colors.indigo.base, // #3F51B5
        background: colors.grey.darken3,
        danger: 'ff6e6e',
      },
    },
  },
});
