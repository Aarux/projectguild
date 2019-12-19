import React, { Component } from "react";

import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import { Officer } from "../../styles/GlobalStyle";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";

class OfficerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: []
    };
  }

  /*
  componendDidMount():

  When this lifecycle triggers it takes in all registered users. This page is only seen by users that have an OFFICER role.
  */

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on("value", snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key
      }));

      this.setState({
        users: usersList,
        loading: false
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <Officer>
        <h1>Officer Page</h1>
        <p>The Officer Page is accessible by every signed in Officer user.</p>

        {loading && <div>Loading ...</div>}

        <UserList users={users} />
      </Officer>
    );
  }
}

const UserList = ({ users }) => (
  <ul>
    <hr />
    {users.map(user => (
      <li key={user.uid}>
        <span>
          <strong>ID: </strong> {user.uid}{" "}
        </span>
        <br />
        <span>
          <strong>E-Mail: </strong> {user.email}{" "}
        </span>
        <br />
        <span>
          <strong>Username: </strong> {user.username}{" "}
        </span>
        <br />
        <span>
          <strong>Role: </strong> {user.roles}{" "}
        </span>
        <hr />
      </li>
    ))}
  </ul>
);

const condition = authUser =>
  authUser && authUser.roles.includes(ROLES.OFFICER);
export default compose(withAuthorization(condition), withFirebase)(OfficerPage);
