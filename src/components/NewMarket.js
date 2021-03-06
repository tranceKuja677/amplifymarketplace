import React from "react";
// prettier-ignore
import { Form, Button, Dialog, Input, Select, Notification } from 'element-react';
import { API, graphqlOperation } from 'aws-amplify';
import { createMarket } from '../graphql/mutations';
import { UserContext } from '../App';

class NewMarket extends React.Component {
  state = {
    addMarketDialog: false,
    name: "",
    tags: ["Arts", "Web Dev", "Technology", "Crafts", "Entertainment"],
    selectedTags: [],
    options: []
  };

  handleAddMarket = async (user) => {
    try {
      this.setState({
        addMarketDialog : false
      });
      const input = {
        name : this.state.name,
        owner: user.username,
        tags: this.state.selectedTags
      }
      const result = await API.graphql(graphqlOperation(createMarket, {input}));
      console.log(result);
      console.info(`Created market id: ${result.data.createMarket.id}`);
      this.setState({ name : "", selectedTags: []})
    } catch(error) {
      console.error(error);
      Notification.error({
        title: "Error", 
        message: `${error.message || "Error adding market"}`
      })
    }
  }

  handleFilterTags = (query) => {
    const options = this.state.tags.map(tag => ({
      value: tag, label: tag
    })).filter(tag => tag.label.toLowerCase().includes(query.toLowerCase()))
    this.setState({
      options
    })
  }

  render() {
    return(
      // Here we can consume the data using the renderProps() function that we can add using an arrow function declaration. 
      <UserContext.Consumer> 
      {( { user }) => 
      <React.Fragment>
        <div className="market-header">
          <h1 className="market-title">
            Create Your MarketPlace
            <Button 
              type="text"
              icon="edit"
              className="market-title-button"
              onClick={() => this.setState({
                addMarketDialog : true
              })}
            />
          </h1>
        </div>
        <Dialog
          title="Create New Market"
          visible={this.state.addMarketDialog}
          onCancel={() => this.setState({ addMarketDialog : false })}
          size="large"
          customClass="dialog"
        >
          <Dialog.Body>
            <Form labelPosition="top">
              <Form.Item label="Add Market Name">
                <Input 
                  placeholder="Market Name"
                  trim={true}
                  onChange={name => this.setState({name})}
                  value={this.state.name}
                />
              </Form.Item>
              <Form.Item>
                <Select 
                  multiple={true}
                  filterable={true}
                  placeholder="Market Tags"
                  onChange={selectedTags => this.setState({ selectedTags })}
                  remoteMethod={this.handleFilterTags}
                  remote={true}
                >
                {this.state.options.map(option => (
                  <Select.Option 
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
                </Select>
              </Form.Item>
            </Form>
          </Dialog.Body>
          <Dialog.Footer>
            <Button onClick={() => this.setState({addMarketDialog : false})}>
              Cancel
            </Button>
            <Button 
              type="primary"
              onClick={() => this.handleAddMarket(user)}
              disabled={!this.state.name}
            >
            Add
          </Button>
          </Dialog.Footer>
        </Dialog> 
        
      </React.Fragment>
      }
      </UserContext.Consumer>
    );
  }
}

export default NewMarket;
