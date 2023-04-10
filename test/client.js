import { fetchPlus } from "../index.js";
const a = async () => {
  try {
    const r = await fetchPlus("http://localhost:3000", {}, 3);
    console.log(r);
  } catch (e) {
    console.log(e);
  }
};

a();
