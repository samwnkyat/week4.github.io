import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';
import pagination from './pagination.js';
const site = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = '124478313';

let productModal = {};
let delProductModal = {};
const app = createApp({
    components: {
        pagination
    },
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: '124478313',
            products: [],
            tempProduct: {
                imagesUrl: [],
            },
            isNew: false,
            pagination: {},
        }
    },
    methods: {
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
                .then(() => {
                    this.getData();
                })
                .catch((err) => {
                    alert(err.data.message)
                    window.location = 'index.html';
                })
        },
        getData(page) { //參數預設值
            //query
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/?page=2`;
            axios.get(url)
                .then((response) => {
                    this.products = response.data.products;
                    this.pagination = response.data.pagination;
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        },
        openProduct(product) {
            this.tempProduct = product;
        },
        openModal(status, product) {
            console.log(status, product);
            if (status === 'isNew') {
                this.tempProduct = {
                    imagesUrl: [],
                }
                productModal.show();
                this.isNew = true;
            } else if (status === 'edit') {
                this.tempProduct = { ...product };
                productModal.show();
                this.isNew = false;
            } else if (status === 'delete') {
                delProductModal.show();
                this.tempProduct = { ...product };
            }

        },
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let method = 'post';
            if (!this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }
            axios[method](url, { data: this.tempProduct })
                .then(res => {
                    console.log(res);
                    this.getData();
                    this.delProduct();
                    productModal.hide();
                })
                .catch((err) => {
                    alert(err.data.message);
                });


        },
        delProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

            axios.delete(url)
                .then((response) => {
                    alert(response.data.message);
                    this.getProducts();
                    delProductModal.hide();
                }).catch((err) => {
                    alert(err.data.message);
                })

        }
    },
    mounted() {
        // 取出 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;

        this.checkAdmin();
        productModal = new bootstrap.Modal(document.getElementById('productModal'));

        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));



    }
});

app.mount('#app');