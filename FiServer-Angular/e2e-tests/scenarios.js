'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /todasLasNotas when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/todasLasNotas");
  });


  describe('todasLasNotas', function() {

    beforeEach(function() {
      browser.get('index.html#!/todasLasNotas');
    });


    it('should render todasLasNotas when user navigates to /todasLasNotas', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('favoritas', function() {

    beforeEach(function() {
      browser.get('index.html#!/favoritas');
    });


    it('should render favoritas when user navigates to /favoritas', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
