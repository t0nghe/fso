import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

describe('renders content', ()=>{

  test('renders title, author, not url or likes', () => {
    const blogPost = {
      title: 'title of test blog',
      like: 5,
      url: 'http://abc.xyz/1',
      author: 'Steve Jobs'
    }

    const component = render(
      <Blog blog={blogPost} />
    )

    expect(component.container).toHaveTextContent(
      'title of test blog'
    )
    expect(component.container).toHaveTextContent(
      'Steve Jobs'
    )

    expect(component.container).not.toHaveTextContent(
      '5'
    )

    expect(component.container).not.toHaveTextContent(
      'http://abc.xyz/1'
    )
  })
})
