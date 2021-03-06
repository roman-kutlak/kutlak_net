/**
 * Created by roman on 09/10/2016.
 */
"use strict";

// https://gist.github.com/maxkfranz/621d51ea7de19608127e

var cy;
var dialog_history = '';
var lastData = undefined;


function submitCommand(event) {
  event.preventDefault();

  var $form = $('#command-form');
  var url = $form.attr('action');

  var client_data = $form.serializeArray();
  client_data.push({name: 'history', value: dialog_history});

  $.post(url, client_data)
    .done(function (data) {
      lastData = data;
      var cmd = $('#command').val();
      dialog_history += cmd + '\n';
      $('#dialog-area').append('USER: ' + cmd + '\n');
      $('#dialog-area').append(data['message']);
      var textarea = $('#dialog-area')[0];
      textarea.scrollTop = textarea.scrollHeight;
      $('#command').val('');
      reloadGraph(data);
    });
}


function reloadGraph(data) {
  console.log(data);
  var changed = false;
  var nodes = data['nodes'];
  var edges = data['edges'];
  var processed = [];
  var existingNodes = cy.elements('node');
  for (var i = 0; i < nodes.length; ++i) {
    var node = nodes[i];
    if (!existingNodes.filter('#' + node.id).length) {
      console.log('adding node: ' + node);
      cy.add({group: 'nodes', data: node});
      processed.push(node.id);
      changed = true;
    } else {
      console.log('node present');
      processed.push(node.id);
    }
  }

  for (i = 0; i < existingNodes.length; ++i) {
    if (processed.indexOf(existingNodes[i].id()) < 0) {
      existingNodes[i].remove();
    }
  }

  for (var j = 0; j < edges.length; ++j) {
    var edge = edges[j];
    if (!cy.$('edge#' + edge.id).length) {
      console.log('adding edge ' + edge);
      cy.add({group: 'edges', data: edge});
    } else {
      console.log('edge already present: ' + edge)
    }
  }

  if (changed) {
    cy.layout({name: 'cola', duration: 4000});
  }

  if (data['labelling'] !== undefined) {
    var nodes_in = data['labelling']['IN'];
    for (i = 0; i < nodes_in.length; ++i) {
      cy.$('node#' + nodes_in[i]).animate({
        style: {backgroundColor: 'green'}
      }, {
        duration: 1000
      });
    }
    var nodes_out = data['labelling']['OUT'];
    for (i = 0; i < nodes_out.length; ++i) {
      cy.$('node#' + nodes_out[i]).animate({
        style: {backgroundColor: 'red'}
      }, {
        duration: 1000
      });
    }
    var nodes_undecided = data['labelling']['UNDEC'];
    for (i = 0; i < nodes_undecided.length; ++i) {
      cy.$('node#' + nodes_undecided[i]).animate({
        style: {backgroundColor: 'grey'}
      }, {
        duration: 1000
      });
    }
  }

}


$('#reload-btn').on('click', function () {
  $.ajax({
    'url': '/socrates/graph/',
    'context': cy
  }).done(function (data) {
    reloadGraph(data);
    dialog_history = '';
  }).error(function (request, textStatus, error) {
    console.log(textStatus);
    console.log(error);
  });
});


$('#fit-btn').on('click', function () {
  cy.animate({
    fit: {
      padding: 30
    }
  }, {
    duration: 1000
  });
});


$('#auto-layout-btn').on('click', function () {
  cy.layout({name: 'cola', duration: 4000});
});


$('#command-form').submit(function (event) {
  submitCommand(event);
});


$('#submit-command-btn').click(function (event) {
  submitCommand(event);
});


$('#submit-kb').click(function () {

  var $form = $('#load-kb-form');
  var url = $form.attr('action');
  var rules = {rules: $('#kb-text-area')[0].value};
  console.log('sending rules: ' + rules);
  $.post(url, rules)
    .done(function (data){
      reloadGraph(data);
      $('#dialog-area').html(data['message']);
      dialog_history = rules.rules + '\n';
    })
    .error(function (request, textStatus, errorThrown) {
      console.log(textStatus);
    })
    .always(function() {
      $('#load-kb-dialog').modal('hide');
    });

});


$('#load-kb-dialog').on('shown.bs.modal', function () {
  $('#kb-text-area').focus()
});


document.addEventListener('DOMContentLoaded', function () { // on dom ready

  cy = cytoscape({
    container: document.querySelector('#cy'),

    boxSelectionEnabled: true,
    // autounselectify: true,
    selectionType: 'single',

    style: cytoscape.stylesheet()
      .selector('node')
      .css({
        'content': 'data(name)',
        'text-valign': 'center',
        'color': 'white',
        'text-outline-width': 2,
        'background-color': '#999',
        'text-outline-color': '#999'
      })
      .selector('edge')
      .css({
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'target-arrow-color': '#ccc',
        'line-color': '#ccc',
        'width': 1
      })
      .selector(':selected')
      .css({
        'background-color': 'black',
        'line-color': 'black',
        'target-arrow-color': 'black',
        'source-arrow-color': 'black'
      })
      .selector('.faded')
      .css({
        'opacity': 0.25,
        'text-opacity': 0
      }),

    elements: {
      nodes: [
        {data: {id: 'p', name: 'p'}},
        {data: {id: 'q', name: 'q'}},
      ],
      edges: [
        {data: {source: 'p', target: 'q'}},
      ]
    },

    layout: {
      name: 'cola',
      padding: 30
    }
  });

  cy.on('tap', 'node', function (e) {
    var node = e.cyTarget;
    var neighborhood = node.neighborhood().add(node);

    cy.elements().addClass('faded');
    neighborhood.removeClass('faded');
  });

  cy.on('tap', function (e) {
    if (e.cyTarget === cy) {
      cy.elements().removeClass('faded');
    }
  });

}); // on dom ready
