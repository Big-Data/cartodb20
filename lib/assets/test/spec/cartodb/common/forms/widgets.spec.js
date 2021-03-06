
describe('Form', function() {
  var view;
  beforeEach(function() {
    var simple_form = [
      {
         name: 'Marker Fill',
         form: {
           'polygon-fill': {
                 type: 'color' ,
                 value: '#00FF00'
            },
            'polygon-opacity': {
                 type: 'opacity' ,
                 value: 0.6
            }
        }
      },
      {
         name: 'test',
         form: {
           'polygon-fill': {
                 type: 'color' ,
                 value: '#00FF00'
            },
            'polygon-opacity': {
                 type: 'opacity' ,
                 value: 0.6
            }
        }
      }
    ]; 
    view = new cdb.forms.Form({
      form_data: simple_form,
      model: new Backbone.Model()
    });


  });

  it('should render form fields', function() {
    view.render();
    expect(view.$('li').length).toEqual(2);
    expect(view.$('.form_color').length).toEqual(2);
    expect(view.$('.form_spinner').length).toEqual(2);
    expect(_.keys(view._subviews).length).toEqual(4);
    view.render();
    expect(view.$('li').length).toEqual(2);
  });

  it('should has a model with properties', function() {
    view.render();
    expect(view.model.get('polygon-fill')).toEqual('#00FF00');
    expect(view.model.get('polygon-opacity')).toEqual(0.6);
  });

  it("should clear fields when render", function() {
    view.render();
    var v = view._subviews[_.keys(view._subviews)[0]];
    expect(v._parent).toEqual(view);
    view.render();
    expect(v._parent).toEqual(null);
  });

  it("should get fields by name", function() {
    view.render();
    var v = view.getFieldsByName('Marker Fill');
    expect(v.length).toEqual(2);
    expect(v[0].options.field_name).toEqual('Marker Fill');
    expect(v[0].options.property).toEqual('polygon-fill');
    expect(v[1].options.field_name).toEqual('Marker Fill');
  });

});

describe('widgets', function() {

  describe('cdb.forms.Color', function() {
    var view, model;
    beforeEach(function() {
      model = new Backbone.Model({ 'test': '#FFF'});
      view = new cdb.forms.Color({ model: model, property: 'test' });
    });

    it("should render", function() {
      view.render();
      expect(view.$('.color').css('background-color')).toEqual('rgb(255, 255, 255)');
    });

    it("should render color", function() {
      model.set({ test: '#000' });
      expect(view.$('.color').css('background-color')).toEqual('rgb(0, 0, 0)');
    });
  });

  describe('cdb.forms.Spinner', function() {
    var view, model;
    beforeEach(function() {
      model = new Backbone.Model({ 'test': 0});
      view = new cdb.forms.Spinner({ el: $('<div>'), 
        model: model, 
        property: 'test',
        min: 0,
        max: 10
      });
    });

    it("should render", function() {
      view.render();
      expect(view.$('.value').val()).toEqual('0');
    });

    it("should render color", function() {
      model.set({ test: 1 });
      expect(view.$('.value').val()).toEqual('1');
    });

    it("should increment/decrement value on click", function() {
      view.render();
      view.$('.plus').trigger('click');
      expect(view.$('.value').val()).toEqual('1');
      expect(model.get('test')).toEqual(1);
      view.$('.minus').trigger('click');
      expect(view.$('.value').val()).toEqual('0');
      expect(model.get('test')).toEqual(0);
    });

    it("should not pass max/min", function() {
      model.set({ test: 9.1 });
      view.options.max = 10;
      view.$('.plus').trigger('click');
      expect(view.$('.value').val()).toEqual('10');

      model.set({ test: 0.1 });
      view.options.min = 0;
      view.$('.minus').trigger('click');
      expect(view.$('.value').val()).toEqual('0');
    });

    it("should increment the value specified", function() {
      model.set({ test: 9.1 });
      view.options.inc = 0.1;
      view.$('.plus').trigger('click');
      expect(view.$('.value').val()).toEqual('9.2');
    });

    it("should change when slider changes", function() {
      view.render();
      view.spinner_slider.trigger('valueSet', 0.55);
      expect(model.get('test')).toEqual(0.55);
    });
  });

  describe('cdb.forms.Combo', function() {
    var view, model;
    beforeEach(function() {
      model = new Backbone.Model({ 'test': 1 });
      view = new cdb.forms.Combo({
        model: model,
        property: 'test',
        extra: [1,2,3,4]
      });
    });

    it("should render", function() {
      view.render();
      expect(view.$('option').length).toEqual(4);
      view.render();
      expect(view.$('option').length).toEqual(4);
    });

    it("should render when model changed", function() {
      view.render();
      model.set({'test': 2});
      expect(view.$('select').val()).toEqual('2');
      console.log(view.$('select'));
    });

    it("when val changes it should update model", function() {
      view.render();
      view.$('select').val('4').change();
      expect(model.get('test')).toEqual('4');
    });

    it("should be able to initialize with values", function() {
      view = new cdb.forms.Combo({
        model: model,
        property: 'test',
        extra: [['one', 1], ['two', 2]]
      });
      view.render();
      view.$('select').val(2).change();
      expect(model.get('test')).toEqual('2');
    });

  });

  describe('cdb.forms.Switch', function() {
    var view, model;
    beforeEach(function() {
      model = new Backbone.Model({ 'test': true });
      view = new cdb.forms.Switch({
        el: $('<a>'),
        model: model,
        property: 'test'
      });
    });

    it("should render", function() {
      view.render();
      expect(view.$el.hasClass('enabled')).toEqual(true);
    });

    it("should render when model changed", function() {
      view.render();
      model.set({'test': false});
      expect(view.$el.hasClass('enabled')).toEqual(false);
      expect(view.$el.hasClass('disabled')).toEqual(true);
    });

    it("when val changes it should update model", function() {
      view.render();
      view.$el.trigger('click');
      expect(model.get('test')).toEqual(false);
    });
  });


});
