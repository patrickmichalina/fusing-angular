describe('Site homepage', () => {
  beforeEach(() => cy.visit('/'))

  describe('Events Widget', () => {
    it('has a link to /events', () => {
      cy.visit('/')
      cy.get('h1')
        .contains('Fusing Angular')
        .click()
      cy.url().should('include', '/events')
    })
  })
})
