'use strict';

describe('Userdashboards E2E Tests:', function () {
  describe('Test Userdashboards page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/userdashboards');
      expect(element.all(by.repeater('userdashboard in userdashboards')).count()).toEqual(0);
    });
  });
});
