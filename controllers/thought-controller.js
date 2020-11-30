const { Thought, User } = require('../models');

const thoughtController = {
        // get all Thoughts
      getAllThought(req, res) {
        Thought.find({})
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          });
      },
    
      // get one Thought by id
      getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
          .then(dbThoughtData => {
            // If no Thought is found, send 404
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No Thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          });
      },
      // createThought
    createThought({ body }, res) {
            Thought.create(body)
                .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thought: _id } },
                    { new: true }
                );
                })
                .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbUserData);
                })
                .catch(err => res.json(err));
        },
      // update Thought by id
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No Thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.status(400).json(err));
      },
      // delete Thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No Thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.status(400).json(err));
      },

      // reaction section
    addReaction({ params, body }, res){
        Thought.findOneAndUpdate({ _id: params.thoughtId}, { $pull: {reactions: body} }, {new: true, runValidators: true})
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: "No thought found with this id!"});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    removeReaction({ params }, res){
        Thought.findOneAndDelete({ _id: params.thoughtId}, { $pull: {reactions: params.reactionId} }, {new: true, runValidators: true})
        .then(thought => {
            if(!thought) {
                res.status(404).json({ message: "No thought found with this id!"});
                return;
            }
            res.json(thought);
        })
        .catch(err => res.status(400).json(err));
    },

};

module.exports = thoughtController;