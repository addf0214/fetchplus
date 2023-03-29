import { fetchPlus } from "../index.js"
const a = async () => {
    const r = await fetchPlus("http://localhost:3000", {}, 3);
    console.log(r)
}

a();
