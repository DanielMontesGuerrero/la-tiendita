import React, {Component} from 'react';
import {Stack, Card} from 'react-bootstrap';
import config from '../common/config';
import axios from 'axios';
import Request from './Request';

class AdminSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
    };
  }

  async componentDidMount() {
    /* let request = [];*/
    const options = {
      url: `${config.host}/user/get_all_requests`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };
    axios(options).then(async (res) => {
      const requests = res.data.response;
      const len = requests.length;
      for (let i = 0; i < len; i++) {
        options.url = `${config.host}/user/${requests[i].id_user}`;
        await axios(options).then((resP) => {
          console.log(resP.data.response);
          requests[i].user = resP.data.response.name;
        });
        options.url = `${config.host}/user/request/${requests[i].id_petition}`;
        await axios(options).then((resP) => {
          console.log(resP.data.response);
          requests[i].downloadLink = resP.data.response;
        });
      }
      this.setState({requests: requests});
      console.log(this.state.requests);
    });
  }
  getRequests() {
    const request = this.state.requests;
    return request.map((item, index) => {
      return (<Request
        user={item.user}
        downloadLink={item.downloadLink}
        id_user={item.id_user}
        voucher={item.voucher}
        id ={item.id_petition}
        key={index}/>);
    });
  }

  render() {
    return (
      <Card className="p-5">
        <Stack gap={3}>
          {this.getRequests()}
        </Stack>
      </Card>
    );
  }
}

export default AdminSettings;


