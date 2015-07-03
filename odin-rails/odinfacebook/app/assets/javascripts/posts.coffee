$ ->
  $('.inf-posts').infinitePages
    debug: true
    buffer: 200
    loading: ->
      $(this).text('Loading...')
    error: ->
      $(this).button('There was an error, please try again')