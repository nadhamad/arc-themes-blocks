import React from 'react';
import { shallow } from 'enzyme';
import StoryItemImage from './story-item-image';

describe('StoryItemImage', () => {
  const mockProps = {
    itemTitle: 'mocktitle',
    imageURL: '',
    websiteURL: 'https://mockUrl.com',
    arcSite: 'the-sun',
    resizedImageOptions: { '400x267': '' },
    targetFallbackImage: {}, // check console
    placeholderResizedImageOptions: {},
    imageRatio: {},
    element: {},
    customFields: {},
  };

  beforeAll(() => {
    jest.mock('fusion:properties', () => (jest.fn(() => ({
      fallbackImage: 'placeholder.jpg',
      resizerURL: 'http://example.com',
      primaryLogoAlt: '',
    }))));
    jest.mock('fusion:context', () => ({
      useFusionContext: jest.fn(() => ({
        arcSite: 'the-sun',
        globalContent: {},
      })),
    }));
  });

  afterAll(() => {
    jest.resetModules();
  });
  // 10/23/20 WIP test
  it('render placeholder image while imageUrl is empty', () => {
    const wrapper = shallow(<StoryItemImage {...mockProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
