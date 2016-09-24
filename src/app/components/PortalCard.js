import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';


const PortalCard = (props) => (
  <Card
    {...props}
  >
    <CardHeader
      title="Data visualization web page"
      subtitle="Portal"
      actAsExpander={true}
      showExpandableButton={true}
      avatar={require('../../images/citi-sense.png')}
    />
    <CardText expandable={true}>
      <CardActions>
        <RaisedButton
          label="Open visualization in new tab"
          target="_blank"
          href="http://srv.dunavnet.eu/new/citisense/OutdoorDataPortal/#"
        />
      </CardActions>
      <p>
        The CITI-SENSE data web page is a web tool for viewing collected data. It is based on input from the CITI- SENSE
        platform that collects anonymized information. The user can choose to look at different data types and to
        combine these in a simple map.
      </p>
      <iframe height="900px" width="100%" src="http://srv.dunavnet.eu/new/citisense/OutdoorDataPortal/#"/>
    </CardText>
  </Card>
);

export default PortalCard;















