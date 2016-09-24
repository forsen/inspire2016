import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';


const COToolBoxCard = (props) => (
  <Card
    {...props}
  >
    <CardHeader
      title="Citizen Observatory Toolbox"
      subtitle="Toolbox"
      actAsExpander={true}
      showExpandableButton={true}
      avatar={require('../../images/toolbox.png')}
    />
    <CardText expandable={true}>
      <CardActions>
        <RaisedButton
          label="Source"
          target="_blank"
          href="https://github.com/forsen/co_toolbox"
        />
      </CardActions>
      <p>
        Multiple applications were made during the CITI-SENSE project. One thing they all had in common was that they
        were made for its own purpose, and reusability was not prioritized. What we see is that there is a lot of common
        functionality in many of the Citizen Observatory applications already created.
      </p>
      <p>
        We believe that a module based toolkit, consisting of modules of common CO functionality could reduce the effort
        needed to create a new CO.
      </p>
      <p>
        Our proposal for a toolkit is built with React Native and Redux. This will ensure that the users will experience
        the familiar native look and feel of their platform without requiring two separate development projects. The
        framework is also well suited for a design approach where the functionality of the application is written in
        reusable modules.
      </p>
      <p>
        As a proof of concept we have recreated the City Air app from CITI-SENSE with reusable modules and want to share
        our experience and possibly create new modules or ideas during this hackathon.
      </p>
    </CardText>
  </Card>
);

export default COToolBoxCard;
