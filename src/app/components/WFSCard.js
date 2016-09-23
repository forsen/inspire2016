import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

const WFSCard = (props) => (
  <Card
    {...props}
  >
    <CardHeader
      title="WFS"
      subtitle="Database"
      actAsExpander={true}
      showExpandableButton={true}
      avatar={require('../../images/ogcwfs.jpg')}
    />
    <CardText expandable={true}>
      Bla bla bla, text about WFS bla bla bla
    </CardText>
  </Card>
);

export default WFSCard;

