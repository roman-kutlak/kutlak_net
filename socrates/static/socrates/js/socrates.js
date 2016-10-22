/**
 * Created by roman on 09/10/2016.
 */
"use strict";

// https://gist.github.com/maxkfranz/621d51ea7de19608127e

var cy;

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
        {data: {id: 'j', name: 'Jerry'}},
        {data: {id: 'e', name: 'Elaine'}},
        {data: {id: 'k', name: 'Kramer'}},
        {data: {id: 'g', name: 'George'}}
      ],
      edges: [
        {data: {source: 'j', target: 'e'}},
        {data: {source: 'j', target: 'k'}},
        {data: {source: 'j', target: 'g'}},
        {data: {source: 'e', target: 'j'}},
        {data: {source: 'e', target: 'k'}},
        {data: {source: 'k', target: 'j'}},
        {data: {source: 'k', target: 'e'}},
        {data: {source: 'k', target: 'g'}},
        {data: {source: 'g', target: 'j'}}
      ]
    },

    layout: {
      name: 'grid',
      padding: 10
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

  $('#reload-btn').on('click', function () {
    $.ajax({
      'url': '/socrates/graph/',
      'context': cy
    }).done(function (data) {
      console.log(data);
      var nodes = data['nodes'];
      var edges = data['edges'];
      var processed = [];
      var existing_nodes = cy.elements('node');
      for (var i = 0; i < nodes.length; ++i) {
        var node = nodes[i];
        if (!existing_nodes.filter('#' + node.id).length) {
          console.log('adding node: ' + node);
          cy.add({group: 'nodes', data: node});
          processed.push(node.id);
        } else {
          console.log('node present');
          processed.push(node.id);
        }
      }

      for (i = 0; i < existing_nodes.length; ++i) {
        if (processed.indexOf(existing_nodes[i].id()) < 0) {
          existing_nodes[i].remove();
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

      cy.animate({
        fit: {
          padding: 20
        }
      }, {
        duration: 1000
      });

    }).error(function (request, textStatus, error) {
      console.log(textStatus);
    });
  });


}); // on dom ready
