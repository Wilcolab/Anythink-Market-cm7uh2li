import React, { useState } from "react";
import agent from "../../agent";
import { connect } from "react-redux";
import { ADD_COMMENT } from "../../constants/actionTypes";

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (payload) => dispatch({ type: ADD_COMMENT, payload }),
});

const CommentInput = (props) => {
  const [ body, setbody] =useState("");
  // constructor() {
    // super();
    // this.state = {
    //   body: "",
    // };

    // this.setBody = (ev) => {
    //   this.setState({ body: ev.target.value });
    // };

    const createComment = async (ev) => {
      ev.preventDefault();
      agent.Comments.create(props.slug, {
        body: body,
      }).then((payload) => {
        props.onSubmit(payload);
      });
      setbody("");
    };
  // }

    return (
      <form className="card comment-form m-2" onSubmit={createComment}>
        <div className="card-block">
          <textarea
            className="form-control"
            placeholder="Write a comment..."
            value={body}
            onChange={(e) => setbody(e.target.value)}
            rows="3"
          ></textarea>
        </div>
        <div className="card-footer">
          <img
            src={props.currentUser.image}
            className="user-pic mr-2"
            alt={props.currentUser.username}
          />
          <button className="btn btn-sm btn-primary" type="submit">
            Post Comment
          </button>
        </div>
      </form>
    );
}

export default connect(() => ({}), mapDispatchToProps)(CommentInput);
