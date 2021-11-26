import React, {Component} from 'react';
import {Stack, Card} from 'react-bootstrap';
import Request from './Request.js';

class AdminSettings extends Component {
  getRequests() {
    const request = [
      {
        user: 'Fulano',
        downloadLink: '#',
      },
      {
        user: 'Daniel',
        downloadLink: '#',
      },
    ];
    return request.map((item, index) => {
      return (<Request
        user={item.user}
        downloadLink={item.downloadLink}
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


