import atracaoModel from "../../models/atracaoModel.js";

const listAllPanel = async (req, res) => {
  try {
    const guiaId = req.userLogged.guiaId;
    const viewAll = req.query.all === 'true';

  
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filters = { ...req.query };
    delete filters.page;
    delete filters.limit;
    delete filters.all;

    if (guiaId && !viewAll) {
     
      filters.guiaId = guiaId;
    }

    const hasFilters = Object.keys(filters).length > 1;

    let result;

    if (hasFilters) {

      result = await atracaoModel.filterPaginated({
        filters,
        skip,
        take: limit,
      });
    } else {
      if (guiaId && !viewAll) {
        result = await atracaoModel.getAllPaginatedPanel({
          skip,
          take: limit,
          guiaId,
        });
      } else {
        result = await atracaoModel.getAllPaginatedPanel({
          skip,
          take: limit
        });
      }
    }

    const { atracoes, total } = result;
    const totalPages = Math.ceil(total / limit);

    return res.json({
      success: "Atrações listadas com sucesso!",
      data: atracoes,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Opsss erro no servidor, tente novamente!",
    });
  }
};

export default listAllPanel;
