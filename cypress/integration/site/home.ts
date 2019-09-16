describe('Site homepage', () => {
  beforeEach(() => cy.visit('/'))

  describe('Events Widget', () => {
    it('has a link to /events', () => {
      cy.viewport('macbook-15')
      cy.get('.hidden-md-down')
        .contains('View All Events')
        .click()
      cy.url().should('include', '/events')
    })
  })
})
