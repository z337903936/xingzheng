import request from '@/utils/request'

export function fetchProductList(query) {
  return request({
    url: '/v1/cp/products/',
    method: 'get',
    params: query
  })
}

export function fetchProduct(id) {
  return request({
    url: '/v1/cp/products/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function createProduct(data) {
  return request({
    url: '/v1/cp/products/new/',
    method: 'post',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: '/v1/cp/products/' + data.id + '/',
    method: 'post',
    data
  })
}

export function addProductImage(data) {
  return request({
    url: '/v1/cp/product_image/new/',
    method: 'post',
    data
  })
}

export function deleteProductImage(data) {
  return request({
    url: '/v1/cp/product_image/',
    method: 'post',
    data
  })
}

export function fetchHotProductList(query) {
  return request({
    url: '/v1/cp/product_carousel/',
    method: 'get',
    params: query
  })
}

export function addProductCarousel(data) {
  return request({
    url: '/v1/cp/product_carousel/new/',
    method: 'post',
    data
  })
}

export function deleteProductCarousel(data) {
  return request({
    url: '/v1/cp/product_carousel/',
    method: 'post',
    data
  })
}

export function listBusinessCategory() {
  return request({
    url: '/v1/business_categories/',
    method: 'get'
  })
}

export function listProductImage(query) {
  return request({
    url: '/v1/cp/product_image/',
    method: 'get',
    params: query
  })
}
