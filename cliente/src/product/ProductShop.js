import React, {Component} from 'react';
import {Stack, Container} from 'react-bootstrap';
import ProductBanner from './ProductBanner.js';
import NavigationBar from '../common/NavigationBar.js';

class ProductShop extends Component {
  getProducts() {
    const products = [
      {
        name: 'Cheetos',
        image: 'https://cdn.shopify.com/s/files/1/0297/6812/2412/products/Cheetos_flaimn_hot_sabritas_150_grs_600x.jpg?v=1599585044',
        score: 4.7,
        description: 'Los mejores cheetos ;)',
        quantity: 150,
        unity: 'g',
      },
      {
        name: 'Halls',
        image: 'https://www.chedraui.com.mx/medias/762221042710-00-CH1200Wx1200H?context=bWFzdGVyfHJvb3R8NjM0NDN8aW1hZ2UvanBlZ3xoNGEvaGU0Lzk5NzA3NDQ1MjQ4MzAuanBnfDcyYmVmMzllZjZlNDFhNDU5MzlhNTcxN2M5YWM3OTAyZGYyMGJjZTJiZDEwY2FmZTI0ZjU0YmVhYzQzNDY0NmE',
        score: 3.2,
        description: 'Halls negras 7u7r',
        quantity: 25.2,
        unity: 'g',
      },
    ];
    return products.map((item, index) => {
      return (<ProductBanner
        name={item.name}
        image={item.image}
        score={item.score}
        description={item.description}
        quantity={item.quantity}
        unity={item.unity}
        key={index}/>);
    });
  }

  render() {
    return (
      <div>
        <NavigationBar/>
        <Container className="mt-4">
          <div className="p-5">
            <Stack gap={3}>
              {this.getProducts()}
            </Stack>
          </div>
        </Container>
      </div>
    );
  }
}

export default ProductShop;


